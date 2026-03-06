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

    public List<AdminResponse> getRestaurant(int page, int size String month) {

        List<Restaurant> restaurants = restaurantRepository.findAll();

        int start = page * size;
        int end = Math.min(start + size, restaurants.size());

        if(start >= restaurants.size()){
            return new ArrayList<>();
        }
        List<Restaurant> pagedRestaurant = restaurants.subList(start, end);

        List<MenuStore> menuStores = menuStoreRepository.findAll();
        HashMap<Long, AdminResponse> resultMap = new HashMap<>();
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
        return new ArrayList<>(resultMap.values());

    }
}
