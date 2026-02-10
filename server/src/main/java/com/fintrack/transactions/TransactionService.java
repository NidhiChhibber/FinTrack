package com.fintrack.transactions;

import com.fintrack.transactions.dto.TransactionRequests;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {
  private final TransactionRepository transactionRepository;

  public TransactionService(TransactionRepository transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  public Page<Transaction> getTransactions(String userId,
                                            LocalDate startDate,
                                            LocalDate endDate,
                                            List<String> categories,
                                            List<String> accountTypes,
                                            List<String> transactionTypes,
                                            String merchantName,
                                            String search,
                                            Double minAmount,
                                            Double maxAmount,
                                            boolean excludeTransfers,
                                            boolean onlyRecurring,
                                            int page,
                                            int limit) {
    Specification<Transaction> spec = Specification.where(TransactionSpecifications.userId(userId));

    if (startDate != null && endDate != null) {
      spec = spec.and(TransactionSpecifications.dateBetween(startDate, endDate));
    } else if (startDate != null) {
      spec = spec.and(TransactionSpecifications.dateAfter(startDate));
    } else if (endDate != null) {
      spec = spec.and(TransactionSpecifications.dateBefore(endDate));
    }

    if (categories != null && !categories.isEmpty()) {
      spec = spec.and(TransactionSpecifications.categories(categories));
    }
    if (accountTypes != null && !accountTypes.isEmpty()) {
      spec = spec.and(TransactionSpecifications.accountTypes(accountTypes));
    }
    if (transactionTypes != null && !transactionTypes.isEmpty()) {
      spec = spec.and(TransactionSpecifications.transactionTypes(transactionTypes));
    }
    if (merchantName != null && !merchantName.isBlank()) {
      spec = spec.and(TransactionSpecifications.merchantNameLike(merchantName));
    }
    if (search != null && !search.isBlank()) {
      spec = spec.and(TransactionSpecifications.nameLike(search));
    }
    if (minAmount != null) {
      spec = spec.and(TransactionSpecifications.amountMin(minAmount));
    }
    if (maxAmount != null) {
      spec = spec.and(TransactionSpecifications.amountMax(maxAmount));
    }
    if (excludeTransfers) {
      spec = spec.and(TransactionSpecifications.excludeTransfers());
    }
    if (onlyRecurring) {
      spec = spec.and(TransactionSpecifications.onlyRecurring());
    }

    Pageable pageable = PageRequest.of(Math.max(page - 1, 0), Math.min(limit, 500));
    return transactionRepository.findAll(spec, pageable);
  }

  public Transaction create(String userId, TransactionRequests.CreateRequest request) {
    Transaction transaction = new Transaction();
    transaction.setUserId(userId);
    transaction.setName(request.name);
    transaction.setAmount(request.amount);
    transaction.setNormalizedAmount(request.normalizedAmount);
    transaction.setDate(request.date);
    transaction.setCategory(request.category);
    transaction.setMerchantName(request.merchantName);
    transaction.setTransactionType(request.transactionType);
    transaction.setAccountType(request.accountType);
    transaction.setAccountSubtype(request.accountSubtype);
    transaction.setPlaidAccountId(request.plaidAccountId);
    transaction.setPlaidItemId(request.plaidItemId);
    transaction.setDescription(request.description);
    if (request.tags != null) {
      transaction.setTags(request.tags);
    }
    transaction.setRecurring(Boolean.TRUE.equals(request.isRecurring));
    transaction.setExcludedFromBudget(Boolean.TRUE.equals(request.isExcludedFromBudget));
    return transactionRepository.save(transaction);
  }

  public Transaction updateById(Long id, TransactionRequests.UpdateRequest request) {
    Transaction transaction = transactionRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));
    applyUpdate(transaction, request);
    return transactionRepository.save(transaction);
  }

  public Transaction updateByPlaidId(String plaidId, TransactionRequests.UpdateRequest request) {
    Transaction transaction = transactionRepository.findByPlaidId(plaidId)
        .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));
    applyUpdate(transaction, request);
    return transactionRepository.save(transaction);
  }

  public Transaction getByPlaidId(String plaidId) {
    return transactionRepository.findByPlaidId(plaidId)
        .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));
  }

  public void deleteByPlaidId(String plaidId) {
    transactionRepository.deleteByPlaidId(plaidId);
  }

  private void applyUpdate(Transaction transaction, TransactionRequests.UpdateRequest request) {
    if (request.category != null) {
      transaction.setCategory(request.category);
      transaction.setCategoryCorrected(true);
      transaction.setCategorySource("user");
    }
    if (request.transactionType != null) {
      transaction.setTransactionType(request.transactionType);
    }
    if (request.merchantName != null) {
      transaction.setMerchantName(request.merchantName);
    }
    if (request.description != null) {
      transaction.setDescription(request.description);
    }
    if (request.tags != null) {
      transaction.setTags(request.tags);
    }
    if (request.isExcludedFromBudget != null) {
      transaction.setExcludedFromBudget(request.isExcludedFromBudget);
    }
  }
}
