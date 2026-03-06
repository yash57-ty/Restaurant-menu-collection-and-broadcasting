package org.example.backendi.model.dto;

public record AdminResponse(
        String name,
        int totalPrice,
        int totalOrderCount,
        int profit
) {}
