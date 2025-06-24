package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TaskDetailsDTO {

    private Long id; // Project ID
    private String name;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private List<TaskDTO> tasks;

    // Getter and Setter methods for all fields
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

    public List<TaskDTO> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskDTO> tasks) {
        this.tasks = tasks;
    }

    // Nested TaskDTO class
    public static class TaskDTO {
        private Long id; // Task ID
        private String title;
        private String status;
        private LocalDateTime dueDate;
        private String priority;
        private Long assignedToId;
        private String category;

        // Getter and Setter methods for task DTO fields
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }
        public Long getAssignedToId() {
            return assignedToId;
        }

        public void setAssignedToId(Long long1) {
            this.assignedToId = long1;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public LocalDateTime getDueDate() {
            return dueDate;
        }

        public void setDueDate(LocalDateTime dueDate) {
            this.dueDate = dueDate;
        }

        public String getPriority() {
            return priority;
        }

        public void setPriority(String priority) {
            this.priority = priority;
        }
        
        public String getCategory() {
        	return category; 
        	} 
        public void setCategory(String category) { 
        	this.category = category; 
        	}
    }
}
