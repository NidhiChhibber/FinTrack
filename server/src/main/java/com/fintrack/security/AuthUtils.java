package com.fintrack.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

public class AuthUtils {
  private AuthUtils() {}

  public static String requireUserId(Authentication authentication) {
    if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
      throw new com.fintrack.common.UnauthorizedException("Unauthorized");
    }
    return jwt.getSubject();
  }
}
