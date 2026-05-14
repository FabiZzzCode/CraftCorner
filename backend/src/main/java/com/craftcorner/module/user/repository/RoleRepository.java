package com.craftcorner.module.user.repository;

import com.craftcorner.module.user.entity.Role;
import com.craftcorner.module.user.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleType name);
}
