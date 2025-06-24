package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "team_members",
       uniqueConstraints = {
           @UniqueConstraint(name = "unique_project_user", columnNames = {"project_id", "user_id"}),
           @UniqueConstraint(name = "unique_project_email", columnNames = {"project_id", "email"})
       })
public class TeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectTeam project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('ADMIN', 'MEMBER') DEFAULT 'MEMBER'")
    private Role role = Role.MEMBER; // Default value 'MEMBER'

    @Column(name = "joined_at", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime joinedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_team_id", nullable = false)
    private ProjectTeam projectTeam;

    // Default constructor
    public TeamMember() {
    }

    // Parameterized constructor
    public TeamMember(ProjectTeam project, User user, String email, Role role, LocalDateTime joinedAt) {
        this.project = project;
        this.user = user;
        this.email = email;
        this.role = role;
        this.joinedAt = joinedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProjectTeam getProject() {
        return project;
    }

    public void setProject(ProjectTeam project) {
        this.project = project;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    
 // Add this method to get the userId 
    public Long getUserId() { 
    	return user != null ? user.getId() : null; 
    	}
    
    // Add this method to set the userId 
    public void setUserId(Long userId) {
    	if (this.user == null) { 
    		this.user = new User();
    		} 
    	this.user.setId(userId);
    	}
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
    
    public void setProjectTeam(ProjectTeam projectTeam) {
        this.projectTeam = projectTeam;
    }


    // toString method
    @Override
    public String toString() {
        return "TeamMember{" +
                "id=" + id +
                ", project=" + (project != null ? project.getId() : null) +
                ", user=" + (user != null ? user.getId() : null) +
                ", email='" + email + '\'' +
                ", role=" + role +
                ", joinedAt=" + joinedAt +
                '}';
    }

    // Role Enum
    public enum Role {
        ADMIN,
        MEMBER
    }
}