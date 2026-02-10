package com.fintrack.plaid;

import com.plaid.client.ApiClient;
import com.plaid.client.request.PlaidApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;

@Configuration
public class PlaidConfig {
  @Value("${app.plaid.client-id}")
  private String clientId;

  @Value("${app.plaid.secret}")
  private String secret;

  @Value("${app.plaid.env}")
  private String env;

  @Bean
  public PlaidApi plaidApi() {
    HashMap<String, String> apiKeys = new HashMap<>();
    apiKeys.put("clientId", clientId);
    apiKeys.put("secret", secret);

    ApiClient apiClient = new ApiClient(apiKeys);
    apiClient.setPlaidAdapter(getPlaidAdapter(env));
    return apiClient.createService(PlaidApi.class);
  }

  private String getPlaidAdapter(String env) {
    if (env == null) {
      return ApiClient.Sandbox;
    }
    return switch (env.toLowerCase()) {
      case "production" -> ApiClient.Production;
      // plaid-java v29 exposes Sandbox/Production constants; Development can be set via URL string
      case "development" -> "https://development.plaid.com";
      default -> ApiClient.Sandbox;
    };
  }
}
