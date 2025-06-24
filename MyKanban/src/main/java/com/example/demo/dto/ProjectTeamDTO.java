package com.example.demo.dto;


import java.time.LocalDateTime;
import java.util.List;

public class ProjectTeamDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String adminName;
    private List<TeamMemberDTO> teamMembers;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime localDateTime) {
        this.startDate = localDateTime;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime localDateTime) {
        this.endDate = localDateTime;
    }

    public String getAdminName() {
        return adminName;
    }

    public void setAdminName(String adminName) {
        this.adminName = adminName;
    }

    public List<TeamMemberDTO> getTeamMembers() {
        return teamMembers;
    }

    public void setTeamMembers(List<TeamMemberDTO> teamMembers) {
        this.teamMembers = teamMembers;
    }
}

