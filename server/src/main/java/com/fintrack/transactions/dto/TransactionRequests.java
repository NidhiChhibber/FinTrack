package com.fintrack.transactions.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class TransactionRequests {
  public static class CreateRequest {
    @NotBlank
    public String name;

    @NotNull
    public Double amount;

    public Double normalizedAmount;

    @NotNull
    public LocalDate date;

    public String category;
    public String merchantName;
    @com.fasterxml.jackson.annotation.JsonProperty("transaction_type")
    public String transactionType;
    public String accountType;
    public String accountSubtype;
    public Long plaidAccountId;
    public Long plaidItemId;
    public String description;
    public List<String> tags;
    public Boolean isRecurring;
    public Boolean isExcludedFromBudget;
  }

  public static class UpdateRequest {
    public String category;
    @com.fasterxml.jackson.annotation.JsonProperty("transaction_type")
    public String transactionType;
    public String merchantName;
    public String description;
    public List<String> tags;
    public Boolean isExcludedFromBudget;
  }
}
