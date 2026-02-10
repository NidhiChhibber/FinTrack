package com.fintrack.transactions.dto;

import com.fintrack.transactions.Transaction;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public class TransactionDto {
  public Long id;
  public String plaidId;
  public String name;
  public double amount;
  public Double normalizedAmount;
  public LocalDate date;
  public String category;
  public String merchantName;
  public String transactionType;
  public String accountType;
  public String accountSubtype;
  public boolean isRecurring;
  public boolean isExcludedFromBudget;
  public boolean categoryCorrected;
  public String categorySource;
  public Double confidence;
  public String description;
  public List<String> tags;
  public Long plaidItemId;
  public Long plaidAccountId;
  public Instant createdAt;
  public Instant updatedAt;

  public static TransactionDto from(Transaction transaction) {
    TransactionDto dto = new TransactionDto();
    dto.id = transaction.getId();
    dto.plaidId = transaction.getPlaidId();
    dto.name = transaction.getName();
    dto.amount = transaction.getAmount();
    dto.normalizedAmount = transaction.getNormalizedAmount();
    dto.date = transaction.getDate();
    dto.category = transaction.getCategory();
    dto.merchantName = transaction.getMerchantName();
    dto.transactionType = transaction.getTransactionType();
    dto.accountType = transaction.getAccountType();
    dto.accountSubtype = transaction.getAccountSubtype();
    dto.isRecurring = transaction.isRecurring();
    dto.isExcludedFromBudget = transaction.isExcludedFromBudget();
    dto.categoryCorrected = transaction.isCategoryCorrected();
    dto.categorySource = transaction.getCategorySource();
    dto.confidence = transaction.getConfidence();
    dto.description = transaction.getDescription();
    dto.tags = transaction.getTags();
    dto.plaidItemId = transaction.getPlaidItemId();
    dto.plaidAccountId = transaction.getPlaidAccountId();
    dto.createdAt = transaction.getCreatedAt();
    dto.updatedAt = transaction.getUpdatedAt();
    return dto;
  }
}
