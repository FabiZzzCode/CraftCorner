package com.craftcorner.module.auth.service;

import com.craftcorner.module.auth.dto.AuthResponse;
import com.craftcorner.module.auth.dto.LoginRequest;
import com.craftcorner.module.auth.dto.RegisterRequest;
import com.craftcorner.module.user.dto.UserDto;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserDto getProfile(String email);
}
