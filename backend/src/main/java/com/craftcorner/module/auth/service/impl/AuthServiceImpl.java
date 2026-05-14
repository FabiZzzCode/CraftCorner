package com.craftcorner.module.auth.service.impl;

import com.craftcorner.common.exception.BusinessException;
import com.craftcorner.module.auth.dto.AuthResponse;
import com.craftcorner.module.auth.dto.LoginRequest;
import com.craftcorner.module.auth.dto.RegisterRequest;
import com.craftcorner.module.auth.service.AuthService;
import com.craftcorner.module.user.dto.UserDto;
import com.craftcorner.module.user.entity.Role;
import com.craftcorner.module.user.entity.User;
import com.craftcorner.module.user.enums.RoleType;
import com.craftcorner.module.user.repository.RoleRepository;
import com.craftcorner.module.user.repository.UserRepository;
import com.craftcorner.module.user.service.UserService;
import com.craftcorner.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email is already registered");
        }

        RoleType roleType = request.getRole() != null ? request.getRole() : RoleType.ROLE_BUYER;
        if (roleType == RoleType.ROLE_ADMIN) {
            throw new BusinessException("Cannot register as admin");
        }

        Role role = roleRepository.findByName(roleType)
                .orElseThrow(() -> new BusinessException("Role not found"));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .roles(Set.of(role))
                .build();

        userRepository.save(user);

        String token = tokenProvider.generateTokenFromEmail(user.getEmail());
        return buildAuthResponse(user, token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String token = tokenProvider.generateToken(auth);
        User user = userService.getEntityByEmail(request.getEmail());
        return buildAuthResponse(user, token);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getProfile(String email) {
        User user = userService.getEntityByEmail(email);
        return toDto(user);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        List<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .toList();
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(roles)
                .build();
    }

    private UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profileImage(user.getProfileImage())
                .isActive(user.isActive())
                .isBlocked(user.isBlocked())
                .roles(user.getRoles().stream().map(r -> r.getName().name()).collect(java.util.stream.Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .build();
    }
}
