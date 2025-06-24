package com.example.demo.model;



import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "users") // This will create a table named "users" in the database
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private boolean enabled = false;

    @Column(name = "otp")
    private String otp;
    
    @Column(name = "otp_expiry")
    private LocalDateTime otpExpiry;

    // Constructors, getters, and setters

    public User() {}

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    // Getter and Setter for otp
    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
    
    public LocalDateTime getOtpExpiry() {
        return otpExpiry;
    }

    public void setOtpExpiry(LocalDateTime otpExpiry) {
        this.otpExpiry = otpExpiry;
    }

	public void setEnabled(boolean enabled) {
		// TODO Auto-generated method stub
		this.enabled = enabled;
		
	}

	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return enabled;
	}
    
    
    
}
