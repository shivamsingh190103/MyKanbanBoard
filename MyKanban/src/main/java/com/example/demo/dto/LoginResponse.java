package com.example.demo.dto;

public class LoginResponse {
    private String message;
    private Long userId;
    private String userName;

    // Constructors
    public LoginResponse(String message, Long userId, String userName) {
        this.message = message;
        this.userId = userId;
        this.userName = userName;
    }

    // Getters and setters
    
    public String getmessage() {
        return message;
    }

    public void setEmail(String message) {
        this.message = message;
    }
    
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getuserName() {
        return userName;
    }

    public void setuserName(String userName) {
        this.userName = userName;
    }
}
