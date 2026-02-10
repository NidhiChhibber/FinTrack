package com.fintrack.plaid;

import com.fintrack.common.ApiResponse;
import com.fintrack.security.AuthUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/plaid")
public class PlaidController {
  private final PlaidService plaidService;

  public PlaidController(PlaidService plaidService) {
    this.plaidService = plaidService;
  }

  @PostMapping("/create_link_token")
  public ResponseEntity<ApiResponse<Map<String, String>>> createLinkToken(Authentication authentication) {
    try {
      String userId = AuthUtils.requireUserId(authentication);
      String linkToken = plaidService.createLinkToken(userId);
      return ResponseEntity.ok(ApiResponse.success(Map.of("linkToken", linkToken)));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(ApiResponse.failure("Failed to create link token", e.getMessage()));
    }
  }

  @PostMapping("/exchange_public_token")
  public ResponseEntity<ApiResponse<Map<String, Object>>> exchangePublicToken(
      @RequestBody ExchangeTokenRequest request,
      Authentication authentication) {
    try {
      String userId = AuthUtils.requireUserId(authentication);
      PlaidItem item = plaidService.exchangePublicToken(
          userId,
          request.publicToken,
          request.institutionId,
          request.institutionName
      );
      return ResponseEntity.ok(ApiResponse.success(Map.of(
          "itemId", item.getItemId(),
          "institutionName", item.getInstitutionName()
      )));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(ApiResponse.failure("Failed to exchange token", e.getMessage()));
    }
  }

  @PostMapping("/sync_transactions")
  public ResponseEntity<ApiResponse<Map<String, Object>>> syncTransactions(Authentication authentication) {
    try {
      String userId = AuthUtils.requireUserId(authentication);
      PlaidService.SyncResult result = plaidService.syncTransactions(userId);
      return ResponseEntity.ok(ApiResponse.success(Map.of(
          "added", result.added(),
          "modified", result.modified(),
          "removed", result.removed(),
          "message", "Sync completed successfully"
      )));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(ApiResponse.failure("Failed to sync transactions", e.getMessage()));
    }
  }

  public static class ExchangeTokenRequest {
    public String publicToken;
    public String institutionId;
    public String institutionName;
  }
}
