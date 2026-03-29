package org.example.backendi.model.dto;

public record LoginRequest(
        String phone,
        String password
){}
