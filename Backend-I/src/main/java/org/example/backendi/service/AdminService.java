package org.example.backendi.service;


import org.example.backendi.model.MenuStore;
import org.example.backendi.model.Restaurant;
import org.example.backendi.model.dto.AdminResponse;
import org.example.backendi.model.dto.RestaurantRequest;
import org.example.backendi.repo.MenuStoreRepository;
import org.example.backendi.repo.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    RestaurantRepository restaurantRepository;
    @Autowired
    MenuStoreRepository menuStoreRepository;

    public ResponseEntity<?> addRestaurant(RestaurantRequest restaurantRequest) {
        Restaurant restaurant = new Restaurant();
        restaurant.setRestaurantName(restaurantRequest.RestaurantName());
        restaurant.setName(restaurantRequest.name());
        restaurant.setPhone("91"+restaurantRequest.Phone());
        restaurantRepository.save(restaurant);
        return ResponseEntity.ok().build();
    }

    public List<AdminResponse> getRestaurant() {

        List<Restaurant> restaurants = restaurantRepository.findAll();
        List<MenuStore> menuStores = menuStoreRepository.findAll();
        HashMap<Long, AdminResponse> resultMap = new HashMap<>();
        for (Restaurant restaurant : restaurants) {
            resultMap.put(
                    restaurant.getId(),
                    new AdminResponse(
                            restaurant.getRestaurantName(),
                            0,
                            0
                    )
            );
        }

        for (MenuStore menuStore : menuStores) {
            Long restaurantId = menuStore.getRestaurant().getId();

            int order = menuStore.getOrerCount();
            int revenue = order * menuStore.getPrice();

            AdminResponse existing = resultMap.get(restaurantId);

            int updatedRevenue = existing.totalPrice() + revenue;
            int updatedOrder = existing.totalOrderCount() + order;
            int profit = updatedOrder * 2;

            resultMap.put(
                    restaurantId,
                    new AdminResponse(
                            existing.name(),
                            updatedRevenue,
                            updatedOrder,
                            profit
                    )
            );
        }
        return new ArrayList<>(resultMap.values());

    }
}
