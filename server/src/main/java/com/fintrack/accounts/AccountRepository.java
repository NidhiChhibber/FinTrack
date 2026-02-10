package com.fintrack.accounts;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
  List<Account> findByUserId(String userId);
  Optional<Account> findByAccountId(String accountId);
}
