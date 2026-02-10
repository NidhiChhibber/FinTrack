package com.fintrack.plaid;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlaidItemRepository extends JpaRepository<PlaidItem, Long> {
  List<PlaidItem> findByUserId(String userId);
  Optional<PlaidItem> findByItemId(String itemId);
}
