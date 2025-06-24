package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.demo.model.TeamMember;
import com.example.demo.repository.TeamMemberRepository;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.server.ResponseStatusException;



@Service
public class TeamMemberService {
 private static final Logger logger = LoggerFactory.getLogger(TeamMemberService.class);

 @Autowired
 private TeamMemberRepository teamMemberRepository;

 public boolean deleteTeamMemberByIdAndProjectId(Long id, Long projectId) {
     TeamMember teamMember = teamMemberRepository.findByIdAndProject_Id(id, projectId);
     if (teamMember != null) {
         teamMemberRepository.delete(teamMember);
         logger.info("Deleted team member with ID {} from project ID {}", id, projectId);
         return true;
     }
     logger.warn("Team member with ID {} does not belong to project ID {}", id, projectId);
     throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team member with ID " + id + " does not belong to project ID " + projectId);
 }

 public void deleteAllByProjectId(Long projectId) {
     List<TeamMember> teamMembers = teamMemberRepository.findByProject_Id(projectId);
     if (!teamMembers.isEmpty()) {
         teamMemberRepository.deleteAll(teamMembers);
         logger.info("Deleted all team members for project ID {}", projectId);
     } else {
         logger.warn("No team members found for project ID {}", projectId);
     }
 }
}

