package org.example.backendi.model.dto;

public record SignupRequest(
        String name,
        String phone,
        String password,
        String email
) {}