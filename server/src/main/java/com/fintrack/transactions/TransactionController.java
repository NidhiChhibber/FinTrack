package com.fintrack.transactions;

import com.fintrack.common.ApiResponse;
import com.fintrack.common.Pagination;
import com.fintrack.security.AuthUtils;
import com.fintrack.transactions.dto.TransactionDto;
import com.fintrack.transactions.dto.TransactionRequests;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
  private final TransactionService transactionService;

  public TransactionController(TransactionService transactionService) {
    this.transactionService = transactionService;
  }

  @GetMapping
  public ResponseEntity<ApiResponse<List<TransactionDto>>> getTransactions(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
      @RequestParam(required = false, name = "category") List<String> categories,
      @RequestParam(required = false, name = "accountType") List<String> accountTypes,
      @RequestParam(required = false, name = "transactionType") List<String> transactionTypes,
      @RequestParam(required = false) String merchantName,
      @RequestParam(required = false) String search,
      @RequestParam(required = false) Double minAmount,
      @RequestParam(required = false) Double maxAmount,
      @RequestParam(required = false, defaultValue = "false") boolean excludeTransfers,
      @RequestParam(required = false, defaultValue = "false") boolean onlyRecurring,
      @RequestParam(required = false, defaultValue = "1") int page,
      @RequestParam(required = false, defaultValue = "50") int limit,
      Authentication authentication
  ) {
    String userId = AuthUtils.requireUserId(authentication);
    Page<Transaction> results = transactionService.getTransactions(
        userId,
        startDate,
        endDate,
        categories,
        accountTypes,
        transactionTypes,
        merchantName,
        search,
        minAmount,
        maxAmount,
        excludeTransfers,
        onlyRecurring,
        page,
        limit
    );

    List<TransactionDto> data = results.getContent().stream()
        .map(TransactionDto::from)
        .collect(Collectors.toList());
    Pagination pagination = new Pagination(page, limit, results.getTotalElements(), results.hasNext());
    return ResponseEntity.ok(ApiResponse.success(data, pagination));
  }

  @GetMapping("/by-plaid-id/{plaidId}")
  public ResponseEntity<ApiResponse<TransactionDto>> getByPlaidId(@PathVariable String plaidId,
                                                                  Authentication authentication) {
    AuthUtils.requireUserId(authentication);
    Transaction transaction = transactionService.getByPlaidId(plaidId);
    return ResponseEntity.ok(ApiResponse.success(TransactionDto.from(transaction)));
  }

  @PostMapping
  public ResponseEntity<ApiResponse<TransactionDto>> create(@Valid @RequestBody TransactionRequests.CreateRequest request,
                                                            Authentication authentication) {
    String userId = AuthUtils.requireUserId(authentication);
    Transaction transaction = transactionService.create(userId, request);
    return ResponseEntity.status(201).body(ApiResponse.success(TransactionDto.from(transaction)));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiResponse<TransactionDto>> update(@PathVariable Long id,
                                                            @Valid @RequestBody TransactionRequests.UpdateRequest request,
                                                            Authentication authentication) {
    AuthUtils.requireUserId(authentication);
    Transaction transaction = transactionService.updateById(id, request);
    return ResponseEntity.ok(ApiResponse.success(TransactionDto.from(transaction)));
  }

  @PutMapping("/by-plaid-id/{plaidId}")
  public ResponseEntity<ApiResponse<TransactionDto>> updateByPlaidId(@PathVariable String plaidId,
                                                                     @Valid @RequestBody TransactionRequests.UpdateRequest request,
                                                                     Authentication authentication) {
    AuthUtils.requireUserId(authentication);
    Transaction transaction = transactionService.updateByPlaidId(plaidId, request);
    return ResponseEntity.ok(ApiResponse.success(TransactionDto.from(transaction)));
  }

  @DeleteMapping("/by-plaid-id/{plaidId}")
  public ResponseEntity<Void> deleteByPlaidId(@PathVariable String plaidId,
                                              Authentication authentication) {
    AuthUtils.requireUserId(authentication);
    transactionService.deleteByPlaidId(plaidId);
    return ResponseEntity.noContent().build();
  }
}
