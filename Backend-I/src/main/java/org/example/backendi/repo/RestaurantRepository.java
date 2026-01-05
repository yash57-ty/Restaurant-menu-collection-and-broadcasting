package org.example.backendi.repo;
import org.example.backendi.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository  extends JpaRepository<Restaurant, Long> {
    Restaurant findByPhone(String phone);
}