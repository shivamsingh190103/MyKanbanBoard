package com.example.demo.dto;

import java.util.List;

public class AddTeamMembersDTO {
    private List<String> emails;

    // Getters and Setters
    public List<String> getEmails() {
        return emails;
    }

    public void setEmails(List<String> emails) {
        this.emails = emails;
    }
}
