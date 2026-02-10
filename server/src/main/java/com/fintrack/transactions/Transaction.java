package com.fintrack.transactions;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.FetchType;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "transactions")
public class Transaction {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String userId;
  private String plaidId;
  private String name;
  private double amount;
  private Double normalizedAmount;
  private LocalDate date;
  private String category;
  private String merchantName;
  private String transactionType;
  private String accountType;
  private String accountSubtype;
  private boolean isRecurring;
  private boolean isExcludedFromBudget;
  private boolean categoryCorrected;
  private String categorySource;
  private Double confidence;
  private String description;

  private Long plaidItemId;
  private Long plaidAccountId;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "transaction_tags", joinColumns = @JoinColumn(name = "transaction_id"))
  private List<String> tags = new ArrayList<>();

  private Instant createdAt;
  private Instant updatedAt;

  @PrePersist
  public void prePersist() {
    if (plaidId == null || plaidId.isBlank()) {
      plaidId = UUID.randomUUID().toString();
    }
    createdAt = Instant.now();
    updatedAt = createdAt;
  }

  @PreUpdate
  public void preUpdate() {
    updatedAt = Instant.now();
  }

  public Long getId() {
    return id;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public String getPlaidId() {
    return plaidId;
  }

  public void setPlaidId(String plaidId) {
    this.plaidId = plaidId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public double getAmount() {
    return amount;
  }

  public void setAmount(double amount) {
    this.amount = amount;
  }

  public Double getNormalizedAmount() {
    return normalizedAmount;
  }

  public void setNormalizedAmount(Double normalizedAmount) {
    this.normalizedAmount = normalizedAmount;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getMerchantName() {
    return merchantName;
  }

  public void setMerchantName(String merchantName) {
    this.merchantName = merchantName;
  }

  public String getTransactionType() {
    return transactionType;
  }

  public void setTransactionType(String transactionType) {
    this.transactionType = transactionType;
  }

  public String getAccountType() {
    return accountType;
  }

  public void setAccountType(String accountType) {
    this.accountType = accountType;
  }

  public String getAccountSubtype() {
    return accountSubtype;
  }

  public void setAccountSubtype(String accountSubtype) {
    this.accountSubtype = accountSubtype;
  }

  public boolean isRecurring() {
    return isRecurring;
  }

  public void setRecurring(boolean recurring) {
    isRecurring = recurring;
  }

  public boolean isExcludedFromBudget() {
    return isExcludedFromBudget;
  }

  public void setExcludedFromBudget(boolean excludedFromBudget) {
    isExcludedFromBudget = excludedFromBudget;
  }

  public boolean isCategoryCorrected() {
    return categoryCorrected;
  }

  public void setCategoryCorrected(boolean categoryCorrected) {
    this.categoryCorrected = categoryCorrected;
  }

  public String getCategorySource() {
    return categorySource;
  }

  public void setCategorySource(String categorySource) {
    this.categorySource = categorySource;
  }

  public Double getConfidence() {
    return confidence;
  }

  public void setConfidence(Double confidence) {
    this.confidence = confidence;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Long getPlaidItemId() {
    return plaidItemId;
  }

  public void setPlaidItemId(Long plaidItemId) {
    this.plaidItemId = plaidItemId;
  }

  public Long getPlaidAccountId() {
    return plaidAccountId;
  }

  public void setPlaidAccountId(Long plaidAccountId) {
    this.plaidAccountId = plaidAccountId;
  }

  public List<String> getTags() {
    return tags;
  }

  public void setTags(List<String> tags) {
    this.tags = tags;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}
