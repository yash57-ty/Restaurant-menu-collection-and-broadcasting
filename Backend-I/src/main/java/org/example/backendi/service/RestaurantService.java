package org.example.backendi.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.example.backendi.model.MenuStore;
import org.example.backendi.model.Restaurant;
import org.example.backendi.repo.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RestaurantService {

    @Autowired
    RestaurantRepository restaurantRepository;
    @Autowired
    MenuService menuService;
    public void getRestaurantdetails(JsonNode messagesNode) {
        String phone = messagesNode.path("from").asText();
        String text = messagesNode.path("text").path("body").asText();

        Restaurant res = restaurantRepository.findByPhone(phone);
        MenuStore mn=new MenuStore();
        if (res != null) {
            System.out.println("Message: " + text);
            mn.setMessage(text);
            mn.setPhoneNumber(res.getPhone());
            menuService.storeMenu(mn);
        }
    }



}
