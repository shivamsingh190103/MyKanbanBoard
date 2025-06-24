package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.*;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.ProjectTeam;
import com.example.demo.model.TeamMember;
import com.example.demo.model.TeamMember.Role;
import com.example.demo.model.User;
import com.example.demo.repository.ProjectTeamRepository;
import com.example.demo.repository.TeamMemberRepository;
import com.example.demo.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
@Service
public class ProjectTeamService {
	private static final Logger logger = LoggerFactory.getLogger(ProjectTeamService.class);
    @Autowired
    private ProjectTeamRepository projectTeamRepository;
    @Autowired
    private TeamMemberRepository teamMemberRepository;
    @Autowired
    private UserRepository userRepository;
    
    public ProjectTeamDTO convertToDTO(ProjectTeam projectTeam) {
        ProjectTeamDTO projectTeamDTO = new ProjectTeamDTO();
        projectTeamDTO.setId(projectTeam.getId());
        projectTeamDTO.setName(projectTeam.getName());
        projectTeamDTO.setDescription(projectTeam.getDescription());
        projectTeamDTO.setStartDate(projectTeam.getStartDate());
        projectTeamDTO.setEndDate(projectTeam.getEndDate());

        // Set adminName
        User createdBy = projectTeam.getCreatedBy();
        if (createdBy != null) {
            projectTeamDTO.setAdminName(createdBy.getName());
        }

        // Set team members
        List<TeamMember> teamMembers = teamMemberRepository.findByProject_Id(projectTeam.getId());
        List<TeamMemberDTO> teamMemberDTOs = new ArrayList<>();
        for (TeamMember teamMember : teamMembers) {
            TeamMemberDTO teamMemberDTO = new TeamMemberDTO();
            teamMemberDTO.setId(teamMember.getId());
            teamMemberDTO.setEmail(teamMember.getEmail());
            // Set the userId
            teamMemberDTO.setUserId(teamMember.getUserId());
            teamMemberDTOs.add(teamMemberDTO);
        }
        projectTeamDTO.setTeamMembers(teamMemberDTOs);

        return projectTeamDTO;
    }

    public ProjectTeam createProject(ProjectCreateDTO projectCreateDTO,Long createdByUserId) {
        
    	// Fetch the user who is creating the project 
    	User createdBy = userRepository.findById(createdByUserId) 
    			.orElseThrow(() -> new RuntimeException("User not found"));

        // Create a new ProjectTeam entity
        ProjectTeam projectTeam = new ProjectTeam(
                projectCreateDTO.getName(),
                projectCreateDTO.getDescription(),
                projectCreateDTO.getStartDate(),
                projectCreateDTO.getEndDate(),
                projectCreateDTO.getStatus(),
                createdBy
        );

        // Save the project in the database
        ProjectTeam savedProject = projectTeamRepository.save(projectTeam);
        
        
     // Add the creator as a team member 
        TeamMember teamMember = new TeamMember(); 
        teamMember.setProject(savedProject); 
        teamMember.setUser(createdBy);
        teamMember.setEmail(createdBy.getEmail()); // Set the email field
        teamMember.setRole(Role.ADMIN);  
        teamMember.setJoinedAt(LocalDateTime.now());
        teamMember.setProjectTeam(savedProject); // Set the project team reference
        teamMemberRepository.save(teamMember);
        
        return savedProject;
    }
 
    public void addMembersToProject(Long projectId, List<String> emails) {
        ProjectTeam project = projectTeamRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        for (String email : emails) {
            if (!isValidEmail(email)) {
                throw new IllegalArgumentException("Invalid email format: " + email);
            }

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

         // Check if the user is already a member of the project 
            if (teamMemberRepository.existsByProjectAndUser(project, user)) { 
            	throw new IllegalArgumentException("User with email " + email + " is already a team member.");
            	}
            
            TeamMember teamMember = new TeamMember();
            teamMember.setProject(project);
            teamMember.setUser(user);
            teamMember.setEmail(user.getEmail());
            teamMember.setRole(TeamMember.Role.MEMBER);
            teamMember.setJoinedAt(LocalDateTime.now());
            teamMember.setProjectTeam(project);

            teamMemberRepository.save(teamMember);
        }
    }


    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return email != null && email.matches(emailRegex);
    }

    public List<ProjectTeamDTO> getProjectsByUserId(Long userId) {
        logger.info("Fetching projects for user ID: {}", userId);

        List<ProjectTeam> adminProjects = projectTeamRepository.findByAdminId(userId);
        List<ProjectTeam> memberProjects = projectTeamRepository.findByTeamMemberId(userId);
        Set<ProjectTeam> allProjects = new HashSet<>();
        allProjects.addAll(adminProjects);
        allProjects.addAll(memberProjects);

        if (allProjects.isEmpty()) {
            logger.warn("No projects found for user ID: {}", userId);
        }

        List<ProjectTeamDTO> projectTeamDTOs = new ArrayList<>();
        for (ProjectTeam project : allProjects) {
            logger.info("Processing project with ID: {}", project.getId());
            ProjectTeamDTO projectTeamDTO = convertToDTO(project);
            projectTeamDTOs.add(projectTeamDTO);
        }

        logger.info("Returning {} projects for user ID: {}", projectTeamDTOs.size(), userId);
        return projectTeamDTOs;
    }

   

    
    @Transactional
    public ProjectTeam updateProject(ProjectUpdateDTO projectUpdateDTO) {
        ProjectTeam existingProject = projectTeamRepository.findById(projectUpdateDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        if (projectUpdateDTO.getName() != null) {
            existingProject.setName(projectUpdateDTO.getName());
        }
        if (projectUpdateDTO.getDescription() != null) {
            existingProject.setDescription(projectUpdateDTO.getDescription());
        }
        if (projectUpdateDTO.getStartDate() != null) {
            existingProject.setStartDate(projectUpdateDTO.getStartDate());
        }
        if (projectUpdateDTO.getEndDate() != null) {
            existingProject.setEndDate(projectUpdateDTO.getEndDate());
        }
        if (projectUpdateDTO.getStatus() != null) {
            existingProject.setStatus(projectUpdateDTO.getStatus());
        }
        existingProject.setUpdatedAt(LocalDateTime.now());

        return projectTeamRepository.save(existingProject);
    }

    

 // ProjectTeamService.java
    public void deleteProject(Long projectId, Long userId) {
        ProjectTeam project = projectTeamRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        if (!project.getCreatedBy().getId().equals(userId)) {
            throw new UnauthorizedException("User is not authorized to delete this project");
        }

        projectTeamRepository.deleteById(projectId);
    }

}