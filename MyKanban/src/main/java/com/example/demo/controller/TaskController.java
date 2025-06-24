package com.example.demo.controller;

import com.example.demo.dto.TaskCreateDTO;
import com.example.demo.dto.TaskDTO;
import com.example.demo.dto.TaskDetailsDTO;
import com.example.demo.model.Task;
import com.example.demo.service.TaskService;

import jakarta.servlet.http.HttpSession;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class TaskController {

    @Autowired
    private TaskService taskService;
    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    
    @GetMapping("/project-details/{userId}")
    public ResponseEntity<?> getProjectDetailsWithTasks(@PathVariable Long userId, HttpSession session) {
    	Long loggedInUserId = (Long) session.getAttribute("userId");
    	if (loggedInUserId == null) {
    	    logger.warn("User is not logged in. Session userId is null.");
    	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    	}
    	logger.info("Logged-in User ID from session: {}", loggedInUserId);

        try {
            List<TaskDetailsDTO> projectDetailsWithTasks = taskService.getProjectDetailsWithTasks(userId);
            return ResponseEntity.ok(projectDetailsWithTasks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        try {
            TaskDTO taskDTO = taskService.getTaskById(id); // Get TaskDTO from service layer
            return ResponseEntity.ok(taskDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
    
    
    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskCreateDTO taskCreateDTO, HttpSession session) {
        Long loggedInUserId = (Long) session.getAttribute("userId");
        if (loggedInUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        logger.info("Creating new task: {}", taskCreateDTO);
        Task createdTask = taskService.createTask(taskCreateDTO, loggedInUserId);
        TaskDTO taskDTO = taskService.convertToDTO(createdTask);
        return ResponseEntity.status(201).body(taskDTO);
    }

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(
            @PathVariable Long id,
            @RequestBody TaskDTO taskDTO,
            HttpSession session) {
        Long loggedInUserId = (Long) session.getAttribute("userId");
        if (loggedInUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TaskDTO updatedTask = taskService.updateTask(id, taskDTO, loggedInUserId);
        return ResponseEntity.ok(updatedTask);
    }

        @DeleteMapping("/{id}")
        public ResponseEntity<?> deleteTask(@PathVariable Long id, HttpSession session) {
            Long loggedInUserId = (Long) session.getAttribute("userId");
            if (loggedInUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            try {
                taskService.deleteTask(id, loggedInUserId);
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
            }
        }


}
