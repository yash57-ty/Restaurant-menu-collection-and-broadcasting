package org.example.backendi.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backendi.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://nakita-unfrequentative-buckishly.ngrok",
        "http://menucollection-env.eba-3fhzuumj.eu-north-1.elasticbeanstalk.com"
})
@RequestMapping("/webhook")
public class RestaurantController {
    private static final String VERIFY_TOKEN = "my_verify_token";

    @Autowired
    RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<String> verifyWebhook(
            @RequestParam("hub.mode") String mode,
            @RequestParam("hub.verify_token") String token,
            @RequestParam("hub.challenge") String challenge) {
        if ("subscribe".equals(mode) && VERIFY_TOKEN.equals(token)) {
            System.out.println("Webhook verified successfully");
            return ResponseEntity.ok(challenge);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Verification failed");
    }

    @PostMapping
    public ResponseEntity<String> receiveMessage(@RequestBody String payload) {
        System.out.println("hello");
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(payload);


            JsonNode entryArray = rootNode.path("entry");
            if (!entryArray.isArray() || entryArray.isEmpty()) {
                return ResponseEntity.ok("NO_ENTRY");
            }

            JsonNode changesArray = entryArray.get(0).path("changes");
            if (!changesArray.isArray() || changesArray.isEmpty()) {
                return ResponseEntity.ok("NO_CHANGES");
            }

            JsonNode messagesArray =
                    changesArray.get(0)
                            .path("value")
                            .path("messages");

            if (!messagesArray.isArray()) {
                return ResponseEntity.ok("NO_MESSAGES");
            }

            for (JsonNode messageNode : messagesArray) {

                if (!"text".equals(messageNode.path("type").asText())) {
                    continue;
                }
                System.out.println(messageNode);
                restaurantService.getRestaurantdetails(messageNode);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok("EVENT_RECEIVED");
    }

    @GetMapping("api/cities")
    List<String> fetchcity(){
        return restaurantService.fetchcity();
    }
}
