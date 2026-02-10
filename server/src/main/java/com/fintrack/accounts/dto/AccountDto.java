package com.fintrack.accounts.dto;

import com.fintrack.accounts.Account;

import java.time.Instant;

public class AccountDto {
  public Long id;
  public String accountId;
  public String name;
  public String officialName;
  public String type;
  public String subtype;
  public String accountType;
  public String accountSubtype;
  public double balance;
  public Double availableBalance;
  public Double creditLimit;
  public Instant balanceLastUpdated;
  public String displayName;
  public String color;
  public boolean isHidden;
  public boolean isActive;
  public Instant deactivatedAt;
  public Long plaidItemId;
  public Instant createdAt;
  public Instant updatedAt;

  public static AccountDto from(Account account) {
    AccountDto dto = new AccountDto();
    dto.id = account.getId();
    dto.accountId = account.getAccountId();
    dto.name = account.getName();
    dto.officialName = account.getOfficialName();
    dto.type = account.getType();
    dto.subtype = account.getSubtype();
    dto.accountType = account.getAccountType();
    dto.accountSubtype = account.getAccountSubtype();
    dto.balance = account.getBalance();
    dto.availableBalance = account.getAvailableBalance();
    dto.creditLimit = account.getCreditLimit();
    dto.balanceLastUpdated = account.getBalanceLastUpdated();
    dto.displayName = account.getDisplayName();
    dto.color = account.getColor();
    dto.isHidden = account.isHidden();
    dto.isActive = account.isActive();
    dto.deactivatedAt = account.getDeactivatedAt();
    dto.plaidItemId = account.getPlaidItemId();
    dto.createdAt = account.getCreatedAt();
    dto.updatedAt = account.getUpdatedAt();
    return dto;
  }
}
