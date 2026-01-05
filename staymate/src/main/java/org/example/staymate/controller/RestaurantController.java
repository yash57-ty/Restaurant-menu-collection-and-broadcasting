package org.example.staymate.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.staymate.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
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
        try {
            System.out.println("RAW PAYLOAD RECEIVED:");
            System.out.println(payload);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(payload);

            JsonNode messagesArray =
                    rootNode.path("entry").get(0)
                            .path("changes").get(0)
                            .path("value")
                            .path("messages");

            if (messagesArray.isArray()) {
                for (JsonNode messageNode : messagesArray) {
                    restaurantService.getRestaurantdetails(messageNode);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok("EVENT_RECEIVED");
    }
}
