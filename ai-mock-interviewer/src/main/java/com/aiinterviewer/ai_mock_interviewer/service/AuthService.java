package com.aiinterviewer.ai_mock_interviewer.service;

import com.aiinterviewer.ai_mock_interviewer.config.JwtUtil;
import com.aiinterviewer.ai_mock_interviewer.dto.AuthResponse;
import com.aiinterviewer.ai_mock_interviewer.dto.LoginRequest;
import com.aiinterviewer.ai_mock_interviewer.dto.RegisterRequest;
import com.aiinterviewer.ai_mock_interviewer.entity.User;
import com.aiinterviewer.ai_mock_interviewer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {

        // 1. Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // 2. Create new user with hashed password
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        // 3. Save to database
        userRepository.save(user);

        // 4. Generate token
        String token = jwtUtil.generateToken(user.getEmail());

        // 5. Return response
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {

        // 1. Verify email and password
        // This throws an exception automatically if credentials are wrong
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Load user from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Generate token
        String token = jwtUtil.generateToken(user.getEmail());

        // 4. Return response
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }
}
