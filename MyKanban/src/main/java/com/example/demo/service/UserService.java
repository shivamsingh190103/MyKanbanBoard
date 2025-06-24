package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.OtpRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.ResetPasswordRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.dto.LoginResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import jakarta.servlet.http.HttpSession;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailService emailService;
    

    public String registerUser(RegisterRequest registerRequest) {
        // Check if user already exists
        Optional<User> existingUser = userRepository.findByEmail(registerRequest.getEmail());
        if (existingUser.isPresent()) {
            User existing = existingUser.get();
            if (existing.isEnabled()) {
                return "User already exists and is verified";
            } else {
                return "User already exists but not verified";
            }
        }
        
        // Create new user
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        // Encode password before saving
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEnabled(false);
        userRepository.save(user);
        
        // Send verification OTP
        return sendOtp(user.getEmail());
    }

  
    public ResponseEntity<LoginResponse> loginUser(LoginRequest loginRequest, HttpSession session) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new LoginResponse("User not found", null, null));
        }

        User user = userOpt.get();

        if (!user.isEnabled()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new LoginResponse("Please verify your email first", null, null));
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new LoginResponse("Invalid password", null, null));
        }

        // Store user details in session
        session.setAttribute("userId", user.getId());
        session.setAttribute("userName", user.getName());
        session.setAttribute("userEmail", user.getEmail());

        // Return a response with user details
        return ResponseEntity.ok(new LoginResponse(
            "Login successful!", 
            user.getId(), 
            user.getName()
        ));
    }

    public String sendOtp(OtpRequest otpRequest) {
        Optional<User> userOpt = userRepository.findByEmail(otpRequest.getEmail());
        if (userOpt.isEmpty()) {
            return "Email not found.";
        }
        
        User user = userOpt.get();
        String otp = String.format("%06d", new Random().nextInt(1000000));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // Send OTP via email
        try {
            emailService.sendOtpEmail(otpRequest.getEmail(), otp);
            return "OTP sent to " + otpRequest.getEmail();
        } catch (Exception e) {
            return "Failed to send OTP. Please try again.";
        }
    }
    public String sendOtp(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return "Email not found.";
        }
        
        User user = userOpt.get();
        String otp = String.format("%06d", new Random().nextInt(1000000));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // Send OTP via email
        try {
            emailService.sendOtpEmail(email, otp);
            return "OTP sent to " + email;
        } catch (Exception e) {
            return "Failed to send OTP. Please try again.";
        }
    }
    
    public String verifyOtp(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return "Email not found";
        }
        
        User user = userOpt.get();
        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            return "No OTP request found";
        }
        
        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            return "OTP has expired";
        }
        
        if (!user.getOtp().equals(otp)) {
            return "Invalid OTP";
        }
        
        user.setEnabled(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
        
        return "OTP verified successfully!";
    }

    public String verifyOtp(OtpRequest otpRequest) {
        Optional<User> userOpt = userRepository.findByEmail(otpRequest.getEmail());
        if (userOpt.isEmpty()) {
            return "Email not found";
        }
        
        User user = userOpt.get();
        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            return "No OTP request found";
        }
        
        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            return "OTP has expired";
        }
        
        if (!user.getOtp().equals(otpRequest.getOtp())) {
            return "Invalid OTP";
        }
        
        user.setEnabled(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
        
        return "OTP verified successfully!";
    }
    
    public String forgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return "User not found";
        }

        User user = userOpt.get();
        String otp = String.format("%06d", new Random().nextInt(1000000));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // Send OTP via email
        try {
            emailService.sendOtpEmail(email, otp);
            return "OTP sent to " + email;
        } catch (Exception e) {
            return "Failed to send OTP. Please try again.";
        }
    }
    
    public String resetPassword(ResetPasswordRequest resetPasswordRequest) {
        Optional<User> userOpt = userRepository.findByEmail(resetPasswordRequest.getEmail());
        if (userOpt.isEmpty()) {
            return "User not found";
        }

        User user = userOpt.get();
        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            return "No OTP request found";
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            return "OTP has expired";
        }

        if (!user.getOtp().equals(resetPasswordRequest.getOtp())) {
            return "Invalid OTP";
        }

        // Update the password
        user.setPassword(passwordEncoder.encode(resetPasswordRequest.getNewPassword()));
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return "Password reset successful!";
    }
}