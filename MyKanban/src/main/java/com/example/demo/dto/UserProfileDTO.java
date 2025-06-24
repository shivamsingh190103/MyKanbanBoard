package com.example.demo.dto;

import java.io.Serializable;

public class UserProfileDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String email;
    private String name;
    private long totalProjects;
    private long totalTasks;
    private long totalActiveTasks;
    private long totalDoneTasks;

    public UserProfileDTO() {}

    public UserProfileDTO(String email, String name, long totalProjects, long totalTasks, long totalActiveTasks, long totalDoneTasks) {
        this.email = email;
        this.name = name;
        this.totalProjects = totalProjects;
        this.totalTasks = totalTasks;
        this.totalActiveTasks = totalActiveTasks;
        this.totalDoneTasks = totalDoneTasks;
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

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getTotalActiveTasks() {
        return totalActiveTasks;
    }

    public void setTotalActiveTasks(long totalActiveTasks) {
        this.totalActiveTasks = totalActiveTasks;
    }

    public long getTotalDoneTasks() {
        return totalDoneTasks;
    }

    public void setTotalDoneTasks(long totalDoneTasks) {
        this.totalDoneTasks = totalDoneTasks;
    }

    @Override
    public String toString() {
        return "UserProfileDTO{" +
                "email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", totalProjects=" + totalProjects +
                ", totalTasks=" + totalTasks +
                ", totalActiveTasks=" + totalActiveTasks +
                ", totalDoneTasks=" + totalDoneTasks +
                '}';
    }
}