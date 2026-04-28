package com.ecommerce.service;
import com.ecommerce.dto.*;
import com.ecommerce.model.User;
import com.ecommerce.model.repository.UserRepository;
import com.ecommerce.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        // Hash password BEFORE storing — never store plain text
        String hashed = passwordEncoder.encode(request.getPassword());
        Long userId = userRepository.save(
                request.getName(), request.getEmail(), hashed);
        String token = jwtUtil.generateToken(
                userId, request.getEmail(), "CUSTOMER");
        return new AuthResponse(
                token, request.getName(), request.getEmail(), "CUSTOMER");
    }
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));
        // BCrypt: compares plain password against stored hash
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            // Same error message for wrong email OR password
            // Prevents attackers from knowing which one was wrong
            throw new RuntimeException("Invalid email or password");
        }
        String token = jwtUtil.generateToken(
                user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(
                token, user.getName(), user.getEmail(), user.getRole());
    }
}