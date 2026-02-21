import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

interface TaskDetailData {
  taskId: number;
}

interface TaskDetail {
  id: number;
  projectId: number;
  assignedToId: number;
  createdBy: number;
  title: string;
  status: string;
  dueDate: string;
  priority: string;
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-task-details-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatSnackBarModule
  ],
  template: `
    <div class="task-details-container">
      <div class="dialog-header">
        <h2>Task Details</h2>
        <button mat-dialog-close class="close-btn">×</button>
      </div>

      <div *ngIf="taskDetail" class="task-content">
        <div class="task-header">
          <h3>{{ taskDetail.title }}</h3>
          <span 
            class="status-badge" 
            [ngClass]="{
              'status-todo': taskDetail.status === 'TODO',
              'status-in-progress': taskDetail.status === 'IN_PROGRESS',
              'status-review': taskDetail.status === 'REVIEW',
              'status-done': taskDetail.status === 'DONE'
            }"
          >
            {{ formatStatus(taskDetail.status) }}
          </span>
        </div>

        <div class="task-details-grid">
          <div class="detail-item">
            <label>Priority</label>
            <span 
              class="priority-badge" 
              [ngClass]="{
                'priority-high': taskDetail.priority === 'HIGH',
                'priority-medium': taskDetail.priority === 'MEDIUM',
                'priority-low': taskDetail.priority === 'LOW'
              }"
            >
              {{ taskDetail.priority }}
            </span>
          </div>

          <div class="detail-item">
            <label>Category</label>
            <span>{{ taskDetail.category }}</span>
          </div>

          <div class="detail-item">
            <label>Due Date</label>
            <span>{{ taskDetail.dueDate | date:'mediumDate' }}</span>
          </div>

          <div class="detail-item">
            <label>Created At</label>
            <span>{{ taskDetail.createdAt | date:'mediumDate' }}</span>
          </div>

          <div class="detail-item">
            <label>Last Updated</label>
            <span>{{ taskDetail.updatedAt | date:'mediumDate' }}</span>
          </div>
        </div>

        <div class="description-section">
          <label>Description</label>
          <p>{{ taskDetail.description }}</p>
        </div>
      </div>

      <div class="dialog-actions">
        <button 
          mat-dialog-close 
          class="btn btn-secondary"
        >
          Close
        </button>
      </div>
    </div>
  `,
  styles: [`
    .task-details-container {
      width: 600px;
      padding: 20px;
      background-color: #f4f5f7;
      border-radius: 8px;
    }

    
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #5e6c84;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .status-badge {
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 0.8em;
      text-transform: uppercase;
    }

    .status-todo { background-color: #f4f5f7; color: #42526e; }
    .status-in-progress { background-color: #0052cc; color: white; }
    .status-review { background-color: #ff5630; color: white; }
    .status-done { background-color: #36b37e; color: white; }

    .priority-badge {
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.8em;
    }

    .priority-high { background-color: #ff5630; color: white; }
    .priority-medium { background-color: #ff8b00; color: white; }
    .priority-low { background-color: #36b37e; color: white; }

    .task-details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
    }

    .detail-item label {
      font-weight: bold;
      margin-bottom: 5px;
      color: #5e6c84;
      font-size: 0.9em;
    }

    .description-section {
      background-color: white;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
    }

    .btn-secondary {
      background-color: #dfe1e6;
      color: #42526e;
    }
  `]
})
export class TaskDetailsDialogComponent implements OnInit {
  taskDetail: TaskDetail | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TaskDetailData,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TaskDetailsDialogComponent>
  ) {}

  ngOnInit(): void {
    this.fetchTaskDetails();
  }

  fetchTaskDetails(): void {
    this.http.get<TaskDetail>(`http://localhost:8080/api/tasks/${this.data.taskId}`, {
      withCredentials: true
    }).subscribe({
      next: (taskDetails) => {
        this.taskDetail = taskDetails;
      },
      error: (err) => {
        console.error('Error fetching task details', err);
        this.snackBar.open('Failed to fetch task details', 'Close', { duration: 2000 });
        this.dialogRef.close();
      }
    });
  }

  formatStatus(status: string): string {
    switch(status) {
      case 'TODO': return 'To Do';
      case 'IN_PROGRESS': return 'In Progress';
      case 'REVIEW': return 'Review';
      case 'DONE': return 'Done';
      default: return status;
    }
  }
}

export default TaskDetailsDialogComponent;
