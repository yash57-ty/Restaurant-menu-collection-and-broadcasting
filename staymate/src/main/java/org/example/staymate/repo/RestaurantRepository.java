package org.example.staymate.repo;

import org.example.staymate.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
public interface RestaurantRepository
        extends JpaRepository<Restaurant, Long> {

    Restaurant findByPhone(String phone);
}
