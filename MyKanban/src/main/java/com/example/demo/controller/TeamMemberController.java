package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.service.TeamMemberService;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/team-members")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class TeamMemberController {
    private final TeamMemberService teamMemberService;

    public TeamMemberController(TeamMemberService teamMemberService) {
        this.teamMemberService = teamMemberService;
    }

    @DeleteMapping("/{id}/project/{projectId}")
    public ResponseEntity<Map<String, Object>> deleteTeamMember(@PathVariable Long id, @PathVariable Long projectId) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean isDeleted = teamMemberService.deleteTeamMemberByIdAndProjectId(id, projectId);
            if (isDeleted) {
                response.put("message", "Team member deleted successfully.");
                response.put("memberId", id);
                response.put("projectId", projectId);
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Team member not found or does not belong to the project.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (ResponseStatusException e) {
            response.put("error", e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(response);
        } catch (Exception e) {
            response.put("error", "An error occurred while deleting the team member.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/project/{projectId}")
    public ResponseEntity<Map<String, Object>> deleteAllByProjectId(@PathVariable Long projectId) {
        Map<String, Object> response = new HashMap<>();
        try {
            teamMemberService.deleteAllByProjectId(projectId);
            response.put("message", "All team members for project ID " + projectId + " deleted successfully.");
            response.put("projectId", projectId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "An error occurred while deleting the project and its team members.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
