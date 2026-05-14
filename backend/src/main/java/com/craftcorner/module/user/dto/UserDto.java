package com.craftcorner.module.user.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private String profileImage;
    private boolean isActive;
    private boolean isBlocked;
    private Set<String> roles;
    private LocalDateTime createdAt;
}
