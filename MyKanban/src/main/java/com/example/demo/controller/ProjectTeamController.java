package com.example.demo.controller;

import com.example.demo.dto.AddTeamMembersDTO;
import com.example.demo.dto.ProjectCreateDTO;
import com.example.demo.dto.ProjectTeamDTO;
import com.example.demo.dto.ProjectUpdateDTO;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.ProjectTeam;
import com.example.demo.service.ProjectTeamService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpSession;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:4200",allowCredentials = "true")
public class ProjectTeamController {

    @Autowired
    private ProjectTeamService projectTeamService; 
    private static final Logger logger = LoggerFactory.getLogger(ProjectTeamService.class);
    @PostMapping
    public ResponseEntity<ProjectTeamDTO> createProject(@RequestBody ProjectCreateDTO projectCreateDTO, HttpSession session) {
    	Long loggedInUserId = (Long) session.getAttribute("userId"); 
    	if (loggedInUserId == null) { 
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    		}
    	
        logger.info("Creating new project: {}", projectCreateDTO);
        ProjectTeam createdProject = projectTeamService.createProject(projectCreateDTO, loggedInUserId);
        ProjectTeamDTO projectTeamDTO = projectTeamService.convertToDTO(createdProject);
        return ResponseEntity.status(201).body(projectTeamDTO);
    }

    @PostMapping("/addmember/{project_id}")
    public ResponseEntity<Map<String, String>> addMembersToProject(
            @PathVariable("project_id") Long projectId,
            @RequestBody AddTeamMembersDTO addTeamMembersDTO) {

        List<String> emails = addTeamMembersDTO.getEmails();
        if (emails == null || emails.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email list is empty or null"));
        }

        for (String email : emails) {
            if (!isValidEmail(email)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid email format: " + email));
            }
        }

        projectTeamService.addMembersToProject(projectId, emails);
        return ResponseEntity.ok(Map.of("message", "Team members added successfully to project ID: " + projectId));
    }



    // Utility method to validate email
    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return email != null && email.matches(emailRegex);
    }



    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProject(
            @PathVariable Long id,
            @RequestBody ProjectUpdateDTO projectUpdateDTO,
            HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        Long loggedInUserId = (Long) session.getAttribute("userId");

        if (loggedInUserId == null) {
            response.put("error", "User is not authorized");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            logger.info("Updating project: {}", projectUpdateDTO);
            projectUpdateDTO.setId(id);
            ProjectTeam updatedProject = projectTeamService.updateProject(projectUpdateDTO);
            response.put("message", "Project updated successfully");
            response.put("updatedProject", projectTeamService.convertToDTO(updatedProject));
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            response.put("error", "Project not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("error", "An error occurred while updating the project");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    
 // ProjectTeamController.java
    @GetMapping("/{userId}")
    public ResponseEntity<List<ProjectTeamDTO>> getProjectsByUserId(@PathVariable Long userId, HttpSession session) {
        Long loggedInUserId = (Long) session.getAttribute("userId");
        if (loggedInUserId == null || !loggedInUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ProjectTeamDTO> projectDTOs = projectTeamService.getProjectsByUserId(userId);
        return ResponseEntity.ok(projectDTOs);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProject(@PathVariable Long id, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        Long loggedInUserId = (Long) session.getAttribute("userId");

        if (loggedInUserId == null) {
            response.put("error", "User is not authorized");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            projectTeamService.deleteProject(id, loggedInUserId);
            response.put("message", "Project deleted successfully");
            response.put("projectId", id);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            response.put("error", "Project not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (UnauthorizedException e) {
            response.put("error", "User is not authorized to delete this project");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } catch (Exception e) {
            response.put("error", "An error occurred while deleting the project");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
