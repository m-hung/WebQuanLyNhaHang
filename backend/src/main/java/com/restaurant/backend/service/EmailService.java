package com.restaurant.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String resetLink, String fullName) {
        String subject = "Yêu cầu đặt lại mật khẩu - Celesté House";
        String text = "Xin chào,\n\n" +
                "Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản quản trị của bạn.\n" +
                "Vui lòng nhấp vào đường link dưới đây để đặt lại mật khẩu mới (Link có hiệu lực trong 30 phút):\n\n" +
                resetLink + "\n\n" +
                "Nếu bạn không yêu cầu, vui lòng bỏ qua email này để đảm bảo an toàn.\n\n" +
                "Trân trọng,\nHệ thống CELESTÉ HOUSE";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("no-reply@restaurant-management.local");

        mailSender.send(message);
        System.out.println("Đã gửi email đặt lại mật khẩu tới: " + to);
    }
}