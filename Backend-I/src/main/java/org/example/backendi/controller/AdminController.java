package org.example.backendi.controller;

import org.example.backendi.model.dto.AdminResponse;
import org.example.backendi.model.dto.RestaurantRequest;
import org.example.backendi.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    AdminService adminService;

    @PostMapping("/addRestaurant")
    public ResponseEntity<?> addRestaurantController(
            @RequestBody RestaurantRequest restaurantRequest
    ) {
        return adminService.addRestaurant(restaurantRequest);
    }

    @GetMapping("/getRestaurant")
    public List<AdminResponse> getAllRestaurantController(

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(required = false) String month
    ) {
        return adminService.getRestaurant(page, size, month);
    }
}