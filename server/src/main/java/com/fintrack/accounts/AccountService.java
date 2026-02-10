package com.fintrack.accounts;

import com.fintrack.accounts.dto.AccountUpdateRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class AccountService {
  private final AccountRepository accountRepository;

  public AccountService(AccountRepository accountRepository) {
    this.accountRepository = accountRepository;
  }

  public List<Account> getAccountsForUser(String userId) {
    return accountRepository.findByUserId(userId);
  }

  public Account updatePreferences(String accountId, AccountUpdateRequest request) {
    Account account = accountRepository.findByAccountId(accountId)
        .orElseThrow(() -> new IllegalArgumentException("Account not found"));
    if (request.displayName != null) {
      account.setDisplayName(request.displayName);
    }
    if (request.color != null) {
      account.setColor(request.color);
    }
    if (request.isHidden != null) {
      account.setHidden(request.isHidden);
    }
    if (request.balance != null) {
      account.setBalance(request.balance);
    }
    if (request.availableBalance != null) {
      account.setAvailableBalance(request.availableBalance);
    }
    account.setBalanceLastUpdated(Instant.now());
    return accountRepository.save(account);
  }
}
