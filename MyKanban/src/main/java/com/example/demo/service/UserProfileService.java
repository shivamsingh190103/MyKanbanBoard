// UserProfileService.java
package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpSession;

import com.example.demo.dto.UserProfileDTO;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.TeamMemberRepository;

@Service
public class UserProfileService {

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @Autowired
    private TaskRepository taskRepository;
    
    public UserProfileDTO getUserProfile(HttpSession session) {
        // Retrieve the userId from the session
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new IllegalArgumentException("User is not logged in");
        }

        // Retrieve the user details from the session
        String email = (String) session.getAttribute("userEmail");
        String name = (String) session.getAttribute("userName");

        // Retrieve the total projects
        long totalProjects = teamMemberRepository.countByUser_Id(userId);
               

        // Retrieve the total tasks
        long totalTasks = taskRepository.countByAssignedToId(userId);

        // Retrieve the total active and done tasks
        long totalActiveTasks = taskRepository.countByAssignedToIdAndStatus(userId, "IN_PROGRESS");
        long totalDoneTasks = taskRepository.countByAssignedToIdAndStatus(userId, "DONE");

        // Return the aggregated profile data
        return new UserProfileDTO(email, name, totalProjects, totalTasks, totalActiveTasks, totalDoneTasks);
    }
}
