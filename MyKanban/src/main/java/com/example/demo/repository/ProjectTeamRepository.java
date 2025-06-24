package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.ProjectTeam;

@Repository
public interface ProjectTeamRepository extends JpaRepository<ProjectTeam, Long> {
	@Query("SELECT p FROM ProjectTeam p WHERE p.createdBy.id = :userId")
    List<ProjectTeam> findByAdminId(@Param("userId") Long userId);

    
    @Query("SELECT p FROM ProjectTeam p JOIN p.teamMembers tm WHERE tm.user.id = :userId")
    List<ProjectTeam> findByTeamMemberId(@Param("userId") Long userId);
    
    long countByCreatedBy_Id(Long createdById);
}