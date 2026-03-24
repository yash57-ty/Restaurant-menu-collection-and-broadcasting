package org.example.backendi.controller;

import org.example.backendi.model.dto.MenuResponse;
import org.example.backendi.model.dto.orderRequest;
import org.example.backendi.model.dto.OrderResponse;
import org.example.backendi.service.MenuService;
import org.example.backendi.service.orderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@CrossOrigin(origins = "*")
@RestController
public class MenuController {
    @Autowired
    MenuService menuService;
    @Autowired
    private orderService orderService;

    @GetMapping("api/message")
    public List<MenuResponse> getMenus(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String city
    ) {
        return menuService.getmenubySearch(keyword, city);
    }


    @PostMapping("api/response")
    public ResponseEntity<?> fetchdata(
            @RequestBody orderRequest request,
            @RequestHeader(value = "X-USER-PHONE", required = false) String userPhone
    ) {

        System.out.print(userPhone);
        if (userPhone == null || userPhone.isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Missing X-USER-PHONE header");
        }

        try {
            OrderResponse response =orderService.fetchorder(request, userPhone);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }
    @GetMapping("api/orders")
    public ResponseEntity<?> getOrders(
            @RequestHeader(value = "X-USER-PHONE", required = false) String userPhone
    ) {

        if (userPhone == null || userPhone.isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Missing X-USER-PHONE header");
        }

        try {
            return ResponseEntity.ok(
                    orderService.getOrdersByUser(userPhone)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }


    @PutMapping("/api/orders/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long orderId,
            @RequestBody Map<String,Integer> body,
            @RequestHeader("X-USER-PHONE") String phone
    ){

        try {

            int cancelQty = body.get("cancelQuantity");

            String result = orderService.cancelOrder(orderId, cancelQty, phone);

            return ResponseEntity.ok(result);

        }catch (RuntimeException e){

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }

    }
}