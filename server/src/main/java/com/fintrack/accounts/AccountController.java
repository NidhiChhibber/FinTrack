package com.fintrack.accounts;

import com.fintrack.accounts.dto.AccountDto;
import com.fintrack.accounts.dto.AccountUpdateRequest;
import com.fintrack.common.ApiResponse;
import com.fintrack.security.AuthUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AccountController {
  private final AccountService accountService;

  public AccountController(AccountService accountService) {
    this.accountService = accountService;
  }

  @GetMapping("/plaid/accounts/{userId}")
  public ResponseEntity<ApiResponse<List<AccountDto>>> getAccounts(@PathVariable String userId,
                                                                   Authentication authentication) {
    String authUserId = AuthUtils.requireUserId(authentication);
    List<AccountDto> accounts = accountService.getAccountsForUser(authUserId).stream()
        .map(AccountDto::from)
        .collect(Collectors.toList());
    return ResponseEntity.ok(ApiResponse.success(accounts));
  }

  @PutMapping("/accounts/{accountId}/preferences")
  public ResponseEntity<ApiResponse<AccountDto>> updatePreferences(@PathVariable String accountId,
                                                                   @Valid @RequestBody AccountUpdateRequest request,
                                                                   Authentication authentication) {
    AuthUtils.requireUserId(authentication);
    Account account = accountService.updatePreferences(accountId, request);
    return ResponseEntity.ok(ApiResponse.success(AccountDto.from(account)));
  }
}
