package com.restaurant.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String role;
    private String fullName;
}