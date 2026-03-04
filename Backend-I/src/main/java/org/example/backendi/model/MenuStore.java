package org.example.backendi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name="Menu_store")
public class MenuStore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String phone;

    @Column(columnDefinition = "TEXT")
    private String menu;

    @Column(nullable = false,updatable = false)
    private LocalDateTime createdDate;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
    }

    @ManyToOne(cascade = CascadeType.ALL)
    Restaurant restaurant;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name="order_limit")
    private Integer limit;

    int price;

    @Column(name="time_limit")
    private String time_limit;

    private Integer OrerCount;

    @Column(name = "state")
    private String state;
}
