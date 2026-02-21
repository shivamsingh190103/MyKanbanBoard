import { Component, OnInit, inject } from '@angular/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from "../sidebar/sidebar.component";
import { AddTaskBoardDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { TaskDetailsDialogComponent } from '../task-detail-dialog/task-detail-dialog.component';
import { EditTaskDialogComponent } from '../edit-task-dialog/edit-task-dialog.component';
import { SessionService } from '../../services/session.service';
import { Task, Project } from '../../model/interface/task-board.model';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    SidebarComponent,
    MatDialogModule,
    CommonModule,
    MatSnackBarModule,
    AddTaskBoardDialogComponent,
    TaskDetailsDialogComponent,
    EditTaskDialogComponent,
    FormsModule,
  ],
  template: `
    <div class="app-container">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <div class="header">
          <h1>Hello {{ userProfile?.userName }}</h1>
          <p>You have {{ projects.length }} projects assigned</p>
        </div>

        <div class="project-selector">
          <select [(ngModel)]="selectedProject" (change)="onProjectChange()">
            <option value="all">All Projects</option>
            <option *ngFor="let project of projects" [value]="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>

        <div class="category-legend">
          <div class="legend-item">
            <div class="legend-color frontend"></div>
            <span>Frontend</span>
          </div>
          <div class="legend-item">
            <div class="legend-color backend"></div>
            <span>Backend</span>
          </div>
          <div class="legend-item">
            <div class="legend-color bugs"></div>
            <span>Bugs</span>
          </div>
          <div class="legend-item">
            <div class="legend-color integration"></div>
            <span>Integration</span>
          </div>
        </div>

        <div class="kanban-board">
          <ng-container *ngFor="let project of displayProjects">
            <div class="project-board">
              <h2>{{ project.name }}</h2>
              <div class="board-columns">
                <div class="column" *ngFor="let status of statuses">
                  <div class="column-header">
                    <h3>{{ status.label }}</h3>
                    <button 
                      class="add-task-btn" 
                      (click)="addTask(project.id, status.value)"
                    >
                      +
                    </button>
                  </div>
                  <div class="tasks-container">
                    <div 
                      *ngFor="let task of getTasksByProjectAndStatus(project.id, status.value)"
                      class="task-card"
                      [ngClass]="[getTaskCategoryClass(task), getTaskPriorityClass(task)]"

                    >
                      <div class="task-content" (click)="openTaskDetails(task)">
                        <h4>{{ task.title }}</h4>
                        <div class="task-meta">
                          <span class="due-date">
                            Due: {{ task.dueDate | date:'shortDate' }}
                          </span>
                          <span class="priority">
                            {{ task.priority }}
                          </span>
                        </div>
                      </div>
                      <div class="task-actions">
                        <button 
                          class="edit-btn" 
                          (click)="editTask(task)"
                        >
                          ✏️
                        </button>
                        <button 
                          class="delete-btn" 
                          (click)="deleteTask(task)"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent implements OnInit {
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private http = inject(HttpClient);
  private sessionService = inject(SessionService);

  userProfile: any = {};
  selectedProject: string = 'all';
  projects: Project[] = [];
  displayProjects: Project[] = [];

  statuses = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'REVIEW', label: 'Review' },
    { value: 'DONE', label: 'Done' }
  ];

  ngOnInit(): void {
    this.userProfile = this.sessionService.getSession();
    this.fetchProjects();
  }

  fetchProjects(): void {
    const session = this.sessionService.getSession();
    if (!session) {
      this.snackBar.open('User not logged in', 'Close', { duration: 2000 });
      return;
    }

    const userId = session.userId;
    this.http.get<Project[]>(`http://localhost:8080/api/tasks/project-details/${userId}`, {
      withCredentials: true
    }).subscribe({
      next: (projects) => {
        this.projects = projects;
        this.displayProjects = projects;
      },
      error: (err) => {
        console.error('Error fetching projects', err);
        this.snackBar.open('Failed to fetch projects', 'Close', { duration: 2000 });
      }
    });
  }

  onProjectChange(): void {
    if (this.selectedProject === 'all') {
      this.displayProjects = this.projects;
    } else {
      this.displayProjects = this.projects.filter(
        project => project.id === +this.selectedProject
      );
    }
  }

  getTasksByProjectAndStatus(projectId: number, status: string): Task[] {
    const project = this.projects.find(p => p.id === projectId);
    return project?.tasks?.filter(task => task.status === status) || [];
  }

  getTaskCategoryClass(task: Task): string {
    switch (task.category) {
      case 'Frontend': return 'category-frontend';
      case 'Backend': return 'category-backend';
      case 'Bugs': return 'category-bugs';
      case 'Integration': return 'category-integration';
      default: return '';
    }
  }
  

  getTaskPriorityClass(task: Task): string {
    switch (task.priority) {
      case 'HIGH': return 'priority-high';
      case 'MEDIUM': return 'priority-medium';
      case 'LOW': return 'priority-low';
      default: return '';
    }
  }

  addTask(projectId: number, status: string): void {
    const dialogRef = this.dialog.open(AddTaskBoardDialogComponent, {
      width: '500px',
      data: { projectId, status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchProjects(); // Refresh to get updated data
        this.snackBar.open('Task Added Successfully', 'Close', { duration: 2000 });
      }
    });
  }

  openTaskDetails(task: Task): void {
    this.dialog.open(TaskDetailsDialogComponent, {
      width: '600px',
      data: { taskId: task.id }
    });
  }

  editTask(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '600px',
      data: { taskId: task.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchProjects(); // Refresh to get updated data
        this.snackBar.open('Task Updated Successfully', 'Close', { duration: 2000 });
      }
    });
  }

  deleteTask(task: Task): void {
    // Implement delete task logic
    // This would typically involve an HTTP call to delete the task
    const confirmDelete = confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      this.http.delete(`http://localhost:8080/api/tasks/${task.id}`, {
        withCredentials: true
      }).subscribe({
        next: () => {
          this.fetchProjects(); // Refresh to get updated data
          this.snackBar.open('Task Deleted Successfully', 'Close', { duration: 2000 });
        },
        error: (err) => {
          console.error('Error deleting task', err);
          this.snackBar.open('Failed to delete task', 'Close', { duration: 2000 });
        }
      });
    }
  }
}