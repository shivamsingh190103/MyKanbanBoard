package com.example.demo.dto;
import java.time.LocalDateTime;
public class ProjectCreateDTO {
	 private String name;
	    private String description;
	    private LocalDateTime startDate;
	    private LocalDateTime endDate;
	    private String status; 
//	    private Long createdBy; // User ID

	    // Getters and Setters
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

	    public void setStartDate(LocalDateTime startDate) {
	        this.startDate = startDate;
	    }

	    public LocalDateTime getEndDate() {
	        return endDate;
	    }

	    public void setEndDate(LocalDateTime endDate) {
	        this.endDate = endDate;
	    }

	    public String getStatus() {
	        return status;
	    }

	    public void setStatus(String status) {
	        this.status = status;
	    }

//	    public Long getCreatedBy() {
//	        return createdBy;
//	    }
//
//	    public void setCreatedBy(Long createdBy) {
//	        this.createdBy = createdBy;
//	    }

}
