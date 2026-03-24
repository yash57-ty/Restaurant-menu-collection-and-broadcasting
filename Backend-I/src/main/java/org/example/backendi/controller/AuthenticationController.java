package org.example.backendi.controller;

import org.example.backendi.model.User;
import org.example.backendi.model.dto.LoginRequest;
import org.example.backendi.model.dto.SignupRequest;
import org.example.backendi.model.dto.UserResponse;
import org.example.backendi.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthenticationController {
    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {

        authService.signup(request);
        System.out.println("Hello");
        return ResponseEntity.ok("Signup successful");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        UserResponse userResponse = authService.login(request);
        return ResponseEntity.ok(userResponse);
    }
}
