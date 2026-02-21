import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-add-task-board-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
  ],
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css'],
})
export class AddTaskBoardDialogComponent implements OnInit {
  newTask = {
    projectId: null,
    assignedToId: null as number | null,
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    category: '',
    status: 'TODO'
  };
  teamMembers: any[] = [];
  projects: any[] = [];
  isStatusDisabled: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddTaskBoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.newTask.projectId = this.data.projectId;
    this.newTask.status = this.data.status;
    this.isStatusDisabled = true; // Disable the status field

    this.fetchProjects();
  }

  fetchProjects(): void {
    const session = this.sessionService.getSession();
    if (session) {
      const userId = session.userId;

      this.http.get<any[]>(`http://localhost:8080/api/projects/${userId}`)
        .subscribe(
          projects => {
            this.projects = projects;
            this.fetchTeamMembers();
          },
          error => {
            console.error('Error fetching projects:', error);
          }
        );
    } else {
      console.error('User is not logged in');
    }
  }

  fetchTeamMembers(): void {
    const selectedProject = this.projects.find(project => project.id === this.newTask.projectId);
    if (selectedProject) {
      this.teamMembers = selectedProject.teamMembers;
    } else {
      console.error('Project not found');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submitTask(): void {
    if (this.isFormValid()) {
      const httpOptions = {
        withCredentials: true
      };
      this.newTask.assignedToId = Number(this.newTask.assignedToId);
      this.newTask.priority = this.newTask.priority.toUpperCase();
      let date = new Date(this.newTask.dueDate);

      if (!(date instanceof Date) || isNaN(date.getTime())) {
        date = new Date(this.newTask.dueDate + 'T23:59:59');
      }

      this.newTask.dueDate = date.toISOString().slice(0, 19);

      const taskPayload = { ...this.newTask };

      console.log('Submitting Task:', taskPayload);

      this.http.post('http://localhost:8080/api/tasks', taskPayload).subscribe(
        response => {
          console.log('Task submitted successfully:', response);
          this.dialogRef.close(response);
        },
        error => {
          console.error('Error submitting task:', error);
        }
      );
    } else {
      alert('Please fill in all the required fields.');
    }
  }

  isFormValid(): boolean {
    return (
      this.newTask.title !== '' &&
      this.newTask.description !== '' &&
      this.newTask.dueDate !== '' &&
      this.newTask.priority !== '' &&
      this.newTask.category !== '' &&
      this.newTask.assignedToId !== null &&
      this.newTask.status !== '' &&
      this.newTask.projectId !== null
    );
  }
}
