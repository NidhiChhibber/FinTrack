package com.fintrack.users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "auth0_id", unique = true)
  private String auth0Id;

  @Column(unique = true)
  private String username;

  @Column(unique = true)
  private String email;


  private String name;
  private String avatar;

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

  public void setId(Long id) {
    this.id = id;
  }

  public String getAuth0Id() {
    return auth0Id;
  }

  public void setAuth0Id(String auth0Id) {
    this.auth0Id = auth0Id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }


  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getAvatar() {
    return avatar;
  }

  public void setAvatar(String avatar) {
    this.avatar = avatar;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}
