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
import java.util.*;

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
        restaurant.setPhone("91" + restaurantRequest.Phone());
        restaurant.setCity(restaurantRequest.City());

        restaurantRepository.save(restaurant);

        return ResponseEntity.ok().build();
    }

    public List<AdminResponse> getRestaurant(int page, int size, String month) {

        List<Restaurant> restaurants = restaurantRepository.findAll();
        List<MenuStore> menuStores = menuStoreRepository.findAll();

        HashMap<Long, AdminResponse> resultMap = new HashMap<>();

        // Initialize restaurant stats
        for (Restaurant restaurant : restaurants) {

            resultMap.put(
                    restaurant.getId(),
                    new AdminResponse(
                            restaurant.getRestaurantName(),
                            0,
                            0,
                            0
                    )
            );
        }

        // Calculate orders and revenue
        for (MenuStore menuStore : menuStores) {

            Long restaurantId = menuStore.getRestaurant().getId();

            if (!resultMap.containsKey(restaurantId)) continue;

            if (month != null && !month.isEmpty()) {

                String menuMonth = menuStore.getCreatedDate().toString().substring(0, 7);

                if (!menuMonth.equals(month)) {
                    continue;
                }
            }

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

        // Convert to list
        List<AdminResponse> allRestaurants = new ArrayList<>(resultMap.values());

        // Pagination
        int start = page * size;
        int end = Math.min(start + size, allRestaurants.size());

        if (start >= allRestaurants.size()) {
            return new ArrayList<>();
        }
        return allRestaurants.subList(start, end);
    }
}