package com.restaurant.backend.controller;

import com.restaurant.backend.entity.User;
import com.restaurant.backend.repository.UserRepository;
import jakarta.persistence.Column;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Lấy tất cả tài khoản
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Thêm tài khoản mới
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String fullName = body.get("fullName");
        String role = body.get("role");
        String status = body.get("status");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("Username đã tồn tại!");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setRole(role != null ? role : "STAFF");
        user.setStatus(status != null ? status : "ACTIVE");
        user.setCreatedAt(LocalDateTime.now());

        return ResponseEntity.ok(userRepository.save(user));
    }

    // Sửa tài khoản
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                        @RequestBody Map<String, String> body) {
        return userRepository.findById(id).map(user -> {
            if (body.get("fullName") != null) user.setFullName(body.get("fullName"));
            if (body.get("role") != null) user.setRole(body.get("role"));
            if (body.get("status") != null) user.setStatus(body.get("status"));

            String newPassword = body.get("password");
            if (newPassword != null && !newPassword.isBlank()) {
                String oldPassword = body.get("oldPassword");

                // Kiểm tra xem mật khẩu cũ truyền lên có khớp với CSDL không
                if (oldPassword == null || !passwordEncoder.matches(oldPassword, user.getPassword())) {
                    return ResponseEntity.badRequest().body("Mật khẩu cũ không chính xác!");
                }

                // Nếu khớp thì mới mã hóa và lưu mật khẩu mới
                user.setPassword(passwordEncoder.encode(newPassword));
            }
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            // Đặt lại mật khẩu về mặc định là 123456
            user.setPassword(passwordEncoder.encode("123456"));
            userRepository.save(user);
            return ResponseEntity.ok().body("Reset mật khẩu thành công!");
        }).orElse(ResponseEntity.notFound().build());
    }

    // Xóa tài khoản
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}