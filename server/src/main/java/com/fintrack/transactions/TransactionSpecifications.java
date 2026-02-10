package com.fintrack.transactions;

import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.List;

public class TransactionSpecifications {
  public static Specification<Transaction> userId(String userId) {
    return (root, query, cb) -> cb.equal(root.get("userId"), userId);
  }

  public static Specification<Transaction> dateBetween(LocalDate start, LocalDate end) {
    return (root, query, cb) -> cb.between(root.get("date"), start, end);
  }

  public static Specification<Transaction> dateAfter(LocalDate start) {
    return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("date"), start);
  }

  public static Specification<Transaction> dateBefore(LocalDate end) {
    return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("date"), end);
  }

  public static Specification<Transaction> categories(List<String> categories) {
    return (root, query, cb) -> root.get("category").in(categories);
  }

  public static Specification<Transaction> accountTypes(List<String> accountTypes) {
    return (root, query, cb) -> root.get("accountType").in(accountTypes);
  }

  public static Specification<Transaction> transactionTypes(List<String> transactionTypes) {
    return (root, query, cb) -> root.get("transactionType").in(transactionTypes);
  }

  public static Specification<Transaction> merchantNameLike(String merchantName) {
    return (root, query, cb) ->
        cb.like(cb.lower(root.get("merchantName")), "%" + merchantName.toLowerCase() + "%");
  }

  public static Specification<Transaction> nameLike(String search) {
    return (root, query, cb) ->
        cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%");
  }

  public static Specification<Transaction> amountMin(double minAmount) {
    return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("amount"), minAmount);
  }

  public static Specification<Transaction> amountMax(double maxAmount) {
    return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("amount"), maxAmount);
  }

  public static Specification<Transaction> excludeTransfers() {
    return (root, query, cb) -> cb.notEqual(root.get("transactionType"), "transfer");
  }

  public static Specification<Transaction> onlyRecurring() {
    return (root, query, cb) -> cb.isTrue(root.get("isRecurring"));
  }
}
