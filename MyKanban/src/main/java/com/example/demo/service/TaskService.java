package com.example.demo.service;

import com.example.demo.dto.TaskCreateDTO;
import com.example.demo.dto.TaskDTO;
import com.example.demo.dto.TaskDetailsDTO;
import com.example.demo.model.ProjectTeam;
import com.example.demo.model.Task;
import com.example.demo.model.User;
import com.example.demo.repository.ProjectTeamRepository;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class TaskService {
    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectTeamRepository projectTeamRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Task createTask(TaskCreateDTO taskCreateDTO, Long createdByUserId) {
        User createdBy = userRepository.findById(createdByUserId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + createdByUserId));

        ProjectTeam project = projectTeamRepository.findById(taskCreateDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found with ID: " + taskCreateDTO.getProjectId()));

        User assignedTo = null;
        if (taskCreateDTO.getAssignedToId() != null) {
            assignedTo = userRepository.findById(taskCreateDTO.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found with ID: " + taskCreateDTO.getAssignedToId()));
        }

        Task task = new Task(
                project,
                assignedTo,
                taskCreateDTO.getTitle(),
                taskCreateDTO.getStatus(),
                taskCreateDTO.getDueDate(),
                taskCreateDTO.getPriority(),
                createdBy,
                LocalDateTime.now(),
                taskCreateDTO.getCategory(),
                taskCreateDTO.getDescription()
        );

        logger.info("Creating task: {}", task.getTitle());
        return taskRepository.save(task);
    }
    
    public List<TaskDetailsDTO> getProjectDetailsWithTasks(Long userId) {
        List<TaskDetailsDTO> taskDetailsList = new ArrayList<>();

        
        List<ProjectTeam> adminProjects = projectTeamRepository.findByAdminId(userId);
        List<ProjectTeam> memberProjects = projectTeamRepository.findByTeamMemberId(userId);
        Set<ProjectTeam> allProjects = new HashSet<>(adminProjects);
        allProjects.addAll(memberProjects);

        for (ProjectTeam project : allProjects) {
            TaskDetailsDTO taskDetailsDTO = new TaskDetailsDTO();
            taskDetailsDTO.setId(project.getId());
            taskDetailsDTO.setName(project.getName());
            taskDetailsDTO.setDescription(project.getDescription());
            taskDetailsDTO.setStartDate(project.getStartDate());
            taskDetailsDTO.setEndDate(project.getEndDate());
            taskDetailsDTO.setStatus(project.getStatus());

            // Map tasks for the project
            List<TaskDetailsDTO.TaskDTO> taskDTOs = new ArrayList<>();
            for (Task task : project.getTasks()) {
                TaskDetailsDTO.TaskDTO taskDTO = new TaskDetailsDTO.TaskDTO();
                taskDTO.setId(task.getId());
                taskDTO.setTitle(task.getTitle());
                if (task.getAssignedTo() != null) {
                    taskDTO.setAssignedToId(task.getAssignedTo().getId());
                }
                taskDTO.setStatus(task.getStatus());
                taskDTO.setDueDate(task.getDueDate());
                taskDTO.setPriority(task.getPriority());
                taskDTO.setCategory(task.getCategory());
                taskDTOs.add(taskDTO);
            }
            taskDetailsDTO.setTasks(taskDTOs);

            taskDetailsList.add(taskDetailsDTO);
        }

        return taskDetailsList;
    }


    @Transactional
    public TaskDTO updateTask(Long taskId, TaskDTO taskDTO, Long updatedByUserId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

        if (taskDTO.getProjectId() != null) {
            ProjectTeam project = projectTeamRepository.findById(taskDTO.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found with ID: " + taskDTO.getProjectId()));
            task.setProject(project);
        }

        if (taskDTO.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(taskDTO.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found with ID: " + taskDTO.getAssignedToId()));
            task.setAssignedTo(assignedTo);
        }

        if (taskDTO.getTitle() != null && !taskDTO.getTitle().isEmpty()) {
            task.setTitle(taskDTO.getTitle());
        }

        if (taskDTO.getStatus() != null && !taskDTO.getStatus().isEmpty()) {
            task.setStatus(taskDTO.getStatus());
        }

        if (taskDTO.getDueDate() != null) {
            task.setDueDate(taskDTO.getDueDate());
        }

        if (taskDTO.getPriority() != null && !taskDTO.getPriority().isEmpty()) {
            task.setPriority(taskDTO.getPriority());
        }

        if (taskDTO.getCategory() != null) {
            task.setCategory(taskDTO.getCategory());
        }

        if (taskDTO.getDescription() != null) {
            task.setDescription(taskDTO.getDescription());
        }

        task.setUpdatedAt(LocalDateTime.now());

        Task updatedTask = taskRepository.save(task);
        logger.info("Updated task with ID: {}", taskId);

        return convertToDTO(updatedTask);
    }

    public TaskDTO convertToDTO(Task task) {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setId(task.getId());
        taskDTO.setTitle(task.getTitle());
        taskDTO.setStatus(task.getStatus());
        taskDTO.setDueDate(task.getDueDate());
        taskDTO.setPriority(task.getPriority());
        taskDTO.setCategory(task.getCategory());
        taskDTO.setDescription(task.getDescription());
        taskDTO.setCreatedAt(task.getCreatedAt());
        taskDTO.setUpdatedAt(task.getUpdatedAt());

        taskDTO.setProjectId(task.getProject().getId());

        if (task.getAssignedTo() != null) {
            taskDTO.setAssignedToId(task.getAssignedTo().getId());
        }

        taskDTO.setCreatedBy(task.getCreatedBy().getId());

        return taskDTO;
    }
    public TaskDTO getTaskById(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("No task found with ID: " + taskId));
        return convertToDTO(task); // Convert to DTO before returning
    }
    
    @Transactional 
    public void deleteTask(Long taskId, Long userId) { 
    	Task task = taskRepository.findById(taskId) 
    			.orElseThrow(() -> new EntityNotFoundException("Task not found")); 
    	if (!task.getCreatedBy().getId().equals(userId)) { 
    		throw new IllegalArgumentException("User is not authorized to delete this task"); 
    		} 
    	taskRepository.delete(task);
    }
}
