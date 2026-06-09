package com.restaurant.backend.controller;

import com.restaurant.backend.dto.LoginRequest;
import com.restaurant.backend.dto.LoginResponse;
import com.restaurant.backend.entity.User;
import com.restaurant.backend.entity.PasswordResetToken;
import com.restaurant.backend.repository.PasswordResetTokenRepository;
import com.restaurant.backend.repository.UserRepository;
import com.restaurant.backend.security.JwtUtil;
import com.restaurant.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Sai tài khoản hoặc mật khẩu!");
        }

        if (!"ACTIVE".equals(user.getStatus())) {
            return ResponseEntity.status(403).body("Tài khoản đã bị khóa!");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return ResponseEntity.ok(new LoginResponse(token, user.getRole(), user.getFullName()));
    }

    @GetMapping("/hash")
    public String hash(@RequestParam String raw) {
        return passwordEncoder.encode(raw);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Vui lòng cung cấp địa chỉ Email!");
        }

        // Tìm user dựa trên Email
        User user = userRepository.findByEmail(email).orElse(null);

        // Nếu nhập sai Email hoặc Email không tồn tại trong CSDL
        if (user == null) {
            return ResponseEntity.badRequest().body("Email không hợp lệ!");
        }

        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(30);

        PasswordResetToken prt = new PasswordResetToken();
        prt.setToken(token);
        prt.setUsername(user.getUsername());
        prt.setExpiryDate(expiry);
        passwordResetTokenRepository.save(prt);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        new Thread(() ->
                emailService.sendPasswordResetEmail(email, resetLink, user.getFullName())
        ).start();
        return ResponseEntity.ok(Map.of("message", "Đã gửi link khôi phục mật khẩu. Vui lòng kiểm tra hộp thư!"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        if (token == null || token.isBlank() || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Token và mật khẩu mới là bắt buộc");
        }

        var opt = passwordResetTokenRepository.findByToken(token);
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body("Token không hợp lệ hoặc đã hết hạn");
        }

        var prt = opt.get();
        if (prt.getExpiryDate() == null || prt.getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(prt); // SỬA Ở ĐÂY: Dùng delete(prt) thay vì deleteByToken
            return ResponseEntity.badRequest().body("Token đã hết hạn");
        }

        User user = userRepository.findByUsername(prt.getUsername()).orElse(null);
        if (user == null) {
            passwordResetTokenRepository.delete(prt); // SỬA Ở ĐÂY
            return ResponseEntity.badRequest().body("Người dùng không tồn tại");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetTokenRepository.delete(prt);

        return ResponseEntity.ok(Map.of("message", "Đặt lại mật khẩu thành công"));
    }
}