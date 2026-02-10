package com.fintrack.security;

import com.fintrack.users.User;
import com.fintrack.users.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class UserProvisioningFilter extends OncePerRequestFilter {
  private final UserRepository userRepository;

  public UserProvisioningFilter(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain)
      throws ServletException, IOException {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
      String userId = jwt.getSubject();
      if (userId != null && !userId.isBlank()) {
        Optional<User> existing = userRepository.findByAuth0Id(userId);
        if (existing.isEmpty()) {
          User user = new User();
          user.setAuth0Id(userId);
          user.setUsername(firstNonBlank(
              jwt.getClaimAsString("preferred_username"),
              jwt.getClaimAsString("nickname"),
              jwt.getClaimAsString("name"),
              userId
          ));
          user.setEmail(jwt.getClaimAsString("email"));
          user.setAvatar(jwt.getClaimAsString("picture"));
          user.setName(jwt.getClaimAsString("name"));
          userRepository.save(user);
        } else {
          User user = existing.get();
          boolean dirty = false;
          String name = jwt.getClaimAsString("name");
          String email = jwt.getClaimAsString("email");
          String picture = jwt.getClaimAsString("picture");
          if (isBlank(user.getName()) && !isBlank(name)) {
            user.setName(name);
            dirty = true;
          }
          if (isBlank(user.getEmail()) && !isBlank(email)) {
            user.setEmail(email);
            dirty = true;
          }
          if (isBlank(user.getAvatar()) && !isBlank(picture)) {
            user.setAvatar(picture);
            dirty = true;
          }
          if (dirty) {
            userRepository.save(user);
          }
        }
      }
    }

    filterChain.doFilter(request, response);
  }

  private static String firstNonBlank(String... values) {
    for (String value : values) {
      if (value != null && !value.isBlank()) {
        return value;
      }
    }
    return null;
  }

  private static boolean isBlank(String value) {
    return value == null || value.isBlank();
  }

}
