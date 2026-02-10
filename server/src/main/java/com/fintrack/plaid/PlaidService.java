package com.fintrack.plaid;

import com.fintrack.accounts.Account;
import com.fintrack.accounts.AccountRepository;
import com.fintrack.transactions.Transaction;
import com.fintrack.transactions.TransactionRepository;
import com.plaid.client.model.*;
import com.plaid.client.request.PlaidApi;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import retrofit2.Response;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
public class PlaidService {
  private final PlaidApi plaidApi;
  private final PlaidItemRepository plaidItemRepository;
  private final AccountRepository accountRepository;
  private final TransactionRepository transactionRepository;

  public PlaidService(PlaidApi plaidApi,
                      PlaidItemRepository plaidItemRepository,
                      AccountRepository accountRepository,
                      TransactionRepository transactionRepository) {
    this.plaidApi = plaidApi;
    this.plaidItemRepository = plaidItemRepository;
    this.accountRepository = accountRepository;
    this.transactionRepository = transactionRepository;
  }

  public String createLinkToken(String userId) throws IOException {
    LinkTokenCreateRequestUser user = new LinkTokenCreateRequestUser().clientUserId(userId);

    // Plaid requires transactions.days_requested within [1, 730]
    LinkTokenTransactions tokenTransactions = new LinkTokenTransactions().daysRequested(730);

    LinkTokenCreateRequest request = new LinkTokenCreateRequest()
        .user(user)
        .clientName("FinTrack")
        .products(Arrays.asList(Products.TRANSACTIONS))
        .countryCodes(Arrays.asList(CountryCode.US))
        .language("en")
        .transactions(tokenTransactions);

    Response<LinkTokenCreateResponse> response = plaidApi.linkTokenCreate(request).execute();
    if (!response.isSuccessful()) {
      throw new RuntimeException("Failed to create link token: " + response.errorBody().string());
    }
    return response.body().getLinkToken();
  }

  public PlaidItem exchangePublicToken(String userId, String publicToken, String institutionId, String institutionName) throws IOException {
    ItemPublicTokenExchangeRequest request = new ItemPublicTokenExchangeRequest().publicToken(publicToken);
    Response<ItemPublicTokenExchangeResponse> response = plaidApi.itemPublicTokenExchange(request).execute();

    if (!response.isSuccessful()) {
      throw new RuntimeException("Failed to exchange public token: " + response.errorBody().string());
    }

    ItemPublicTokenExchangeResponse body = response.body();

    PlaidItem item = new PlaidItem();
    item.setUserId(userId);
    item.setItemId(body.getItemId());
    item.setAccessToken(body.getAccessToken());
    item.setInstitutionId(institutionId);
    item.setInstitutionName(institutionName);
    return plaidItemRepository.save(item);
  }

  @Transactional
  public SyncResult syncTransactions(String userId) throws IOException {
    List<PlaidItem> items = plaidItemRepository.findByUserId(userId);
    int added = 0;
    int modified = 0;
    int removed = 0;

    for (PlaidItem item : items) {
      SyncResult result = syncItemTransactions(item, userId);
      added += result.added;
      modified += result.modified;
      removed += result.removed;
    }

    return new SyncResult(added, modified, removed);
  }

  private SyncResult syncItemTransactions(PlaidItem item, String userId) throws IOException {
    int added = 0, modified = 0, removed = 0;
    String cursor = item.getCursor();
    boolean hasMore = true;

    // First sync accounts
    syncAccounts(item, userId);

    while (hasMore) {
      TransactionsSyncRequest request = new TransactionsSyncRequest()
          .accessToken(item.getAccessToken());
      if (cursor != null) {
        request.cursor(cursor);
      }

      Response<TransactionsSyncResponse> response = plaidApi.transactionsSync(request).execute();
      if (!response.isSuccessful()) {
        throw new RuntimeException("Failed to sync transactions: " + response.errorBody().string());
      }

      TransactionsSyncResponse body = response.body();

      // Process added transactions
      for (com.plaid.client.model.Transaction plaidTxn : body.getAdded()) {
        saveTransaction(plaidTxn, item, userId);
        added++;
      }

      // Process modified transactions
      for (com.plaid.client.model.Transaction plaidTxn : body.getModified()) {
        saveTransaction(plaidTxn, item, userId);
        modified++;
      }

      // Process removed transactions
      for (RemovedTransaction removedTxn : body.getRemoved()) {
        transactionRepository.deleteByPlaidId(removedTxn.getTransactionId());
        removed++;
      }

      cursor = body.getNextCursor();
      hasMore = body.getHasMore();
    }

    item.setCursor(cursor);
    item.setLastSynced(Instant.now());
    plaidItemRepository.save(item);

    return new SyncResult(added, modified, removed);
  }

  private void syncAccounts(PlaidItem item, String userId) throws IOException {
    AccountsGetRequest request = new AccountsGetRequest().accessToken(item.getAccessToken());
    Response<AccountsGetResponse> response = plaidApi.accountsGet(request).execute();

    if (!response.isSuccessful()) {
      throw new RuntimeException("Failed to get accounts: " + response.errorBody().string());
    }

    for (AccountBase plaidAccount : response.body().getAccounts()) {
      Account account = accountRepository.findByAccountId(plaidAccount.getAccountId())
          .orElse(new Account());

      account.setUserId(userId);
      account.setAccountId(plaidAccount.getAccountId());
      account.setName(plaidAccount.getName());
      account.setOfficialName(plaidAccount.getOfficialName());
      account.setType(plaidAccount.getType().getValue());
      account.setSubtype(plaidAccount.getSubtype() != null ? plaidAccount.getSubtype().getValue() : null);
      account.setAccountType(mapAccountType(plaidAccount.getType()));
      account.setBalance(plaidAccount.getBalances().getCurrent() != null ? plaidAccount.getBalances().getCurrent() : 0);
      account.setAvailableBalance(plaidAccount.getBalances().getAvailable());
      account.setCreditLimit(plaidAccount.getBalances().getLimit());
      account.setBalanceLastUpdated(Instant.now());
      account.setPlaidItemId(item.getId());

      accountRepository.save(account);
    }
  }

  private void saveTransaction(com.plaid.client.model.Transaction plaidTxn, PlaidItem item, String userId) {
    Transaction txn = transactionRepository.findByPlaidId(plaidTxn.getTransactionId())
        .orElse(new Transaction());

    txn.setUserId(userId);
    txn.setPlaidId(plaidTxn.getTransactionId());
    txn.setName(plaidTxn.getName());
    txn.setAmount(plaidTxn.getAmount());
    txn.setNormalizedAmount(plaidTxn.getAmount() < 0 ? -plaidTxn.getAmount() : plaidTxn.getAmount());
    txn.setDate(plaidTxn.getDate());
    txn.setMerchantName(plaidTxn.getMerchantName());
    txn.setPlaidItemId(item.getId());

    // Set category from Plaid
    if (plaidTxn.getCategory() != null && !plaidTxn.getCategory().isEmpty()) {
      txn.setCategory(plaidTxn.getCategory().get(plaidTxn.getCategory().size() - 1));
      txn.setCategorySource("plaid");
    }

    // Determine transaction type based on amount
    if (plaidTxn.getAmount() < 0) {
      txn.setTransactionType("income");
    } else {
      txn.setTransactionType("expense");
    }

    // Find associated account
    Account account = accountRepository.findByAccountId(plaidTxn.getAccountId()).orElse(null);
    if (account != null) {
      txn.setPlaidAccountId(account.getId());
      txn.setAccountType(account.getAccountType());
      txn.setAccountSubtype(account.getAccountSubtype());
    }

    transactionRepository.save(txn);
  }

  private String mapAccountType(AccountType type) {
    return switch (type) {
      case DEPOSITORY -> "checking";
      case CREDIT -> "credit";
      case LOAN -> "loan";
      case INVESTMENT -> "investment";
      default -> "other";
    };
  }

  public record SyncResult(int added, int modified, int removed) {}
}
