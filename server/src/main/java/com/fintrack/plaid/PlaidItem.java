package com.fintrack.plaid;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "plaid_items")
public class PlaidItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String userId;
  private String itemId;
  private String accessToken;
  private String institutionId;
  private String institutionName;
  private String cursor;
  private Instant lastSynced;
  private boolean requiresReauth;
  private String errorCode;
  private String errorMessage;
  private boolean isActive = true;

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

  public Long getId() { return id; }
  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }
  public String getItemId() { return itemId; }
  public void setItemId(String itemId) { this.itemId = itemId; }
  public String getAccessToken() { return accessToken; }
  public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
  public String getInstitutionId() { return institutionId; }
  public void setInstitutionId(String institutionId) { this.institutionId = institutionId; }
  public String getInstitutionName() { return institutionName; }
  public void setInstitutionName(String institutionName) { this.institutionName = institutionName; }
  public String getCursor() { return cursor; }
  public void setCursor(String cursor) { this.cursor = cursor; }
  public Instant getLastSynced() { return lastSynced; }
  public void setLastSynced(Instant lastSynced) { this.lastSynced = lastSynced; }
  public boolean isRequiresReauth() { return requiresReauth; }
  public void setRequiresReauth(boolean requiresReauth) { this.requiresReauth = requiresReauth; }
  public String getErrorCode() { return errorCode; }
  public void setErrorCode(String errorCode) { this.errorCode = errorCode; }
  public String getErrorMessage() { return errorMessage; }
  public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
  public boolean isActive() { return isActive; }
  public void setActive(boolean active) { isActive = active; }
  public Instant getCreatedAt() { return createdAt; }
  public Instant getUpdatedAt() { return updatedAt; }
}
