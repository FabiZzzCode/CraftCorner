package com.craftcorner.module.user.service;

import com.craftcorner.module.user.dto.ChangePasswordRequest;
import com.craftcorner.module.user.dto.UserDto;
import com.craftcorner.module.user.dto.UserUpdateRequest;
import com.craftcorner.module.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Page<UserDto> getAllUsers(Pageable pageable);
    UserDto getUserById(Long id);
    UserDto updateUser(Long id, UserUpdateRequest request);
    void deleteUser(Long id);
    void blockUser(Long id);
    void unblockUser(Long id);
    void changePassword(String email, ChangePasswordRequest request);
    User getEntityByEmail(String email);
    User getEntityById(Long id);
}
