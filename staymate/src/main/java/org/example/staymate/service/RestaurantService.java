package org.example.staymate.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.example.staymate.model.Restaurant;
import org.example.staymate.repo.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RestaurantService {

    @Autowired
    RestaurantRepository restaurantRepository;

    public void getRestaurantdetails(JsonNode messagesNode) {
        String phone=messagesNode.path("from").asText();
        String text=messagesNode.path("text").path("body").asText();

        Restaurant res=restaurantRepository.findByPhone(phone);
        if (res != null) {
            System.out.println("Restaurant: " + res.getName());
            System.out.println("Phone: " + res.getPhone());
            System.out.println("Message: " + text);
        }
        // change
    }
}

