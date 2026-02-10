package com.fintrack.accounts;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "accounts")
public class Account {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String userId;
  private String accountId;
  private String name;
  private String officialName;
  private String type;
  private String subtype;
  private String accountType;
  private String accountSubtype;
  private double balance;
  private Double availableBalance;
  private Double creditLimit;
  private Instant balanceLastUpdated;
  private String displayName;
  private String color;
  private boolean isHidden;
  private boolean isActive = true;
  private Instant deactivatedAt;
  private Long plaidItemId;

  private Instant createdAt;
  private Instant updatedAt;

  @PrePersist
  public void prePersist() {
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

  public String getAccountId() {
    return accountId;
  }

  public void setAccountId(String accountId) {
    this.accountId = accountId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getOfficialName() {
    return officialName;
  }

  public void setOfficialName(String officialName) {
    this.officialName = officialName;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getSubtype() {
    return subtype;
  }

  public void setSubtype(String subtype) {
    this.subtype = subtype;
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

  public double getBalance() {
    return balance;
  }

  public void setBalance(double balance) {
    this.balance = balance;
  }

  public Double getAvailableBalance() {
    return availableBalance;
  }

  public void setAvailableBalance(Double availableBalance) {
    this.availableBalance = availableBalance;
  }

  public Double getCreditLimit() {
    return creditLimit;
  }

  public void setCreditLimit(Double creditLimit) {
    this.creditLimit = creditLimit;
  }

  public Instant getBalanceLastUpdated() {
    return balanceLastUpdated;
  }

  public void setBalanceLastUpdated(Instant balanceLastUpdated) {
    this.balanceLastUpdated = balanceLastUpdated;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public String getColor() {
    return color;
  }

  public void setColor(String color) {
    this.color = color;
  }

  public boolean isHidden() {
    return isHidden;
  }

  public void setHidden(boolean hidden) {
    isHidden = hidden;
  }

  public boolean isActive() {
    return isActive;
  }

  public void setActive(boolean active) {
    isActive = active;
  }

  public Instant getDeactivatedAt() {
    return deactivatedAt;
  }

  public void setDeactivatedAt(Instant deactivatedAt) {
    this.deactivatedAt = deactivatedAt;
  }

  public Long getPlaidItemId() {
    return plaidItemId;
  }

  public void setPlaidItemId(Long plaidItemId) {
    this.plaidItemId = plaidItemId;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}
