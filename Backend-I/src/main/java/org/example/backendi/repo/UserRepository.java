package org.example.backendi.repo;

import org.example.backendi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByPhone(String phone);
    Optional<User> findByEmail(String email);
}
