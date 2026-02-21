import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  MAT_DIALOG_DATA, 
  MatDialogRef, 
  MatDialogModule 
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

interface EditTaskDialogData {
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
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatSnackBarModule
  ],
  template: `
    <div class="edit-task-container">
      <div class="dialog-header">
        <h2>Edit Task</h2>
        <button mat-dialog-close class="close-btn">×</button>
      </div>

      <form *ngIf="taskDetail" (ngSubmit)="updateTask()" class="edit-task-form">
        <div class="form-group">
          <label>Title</label>
          <input 
            type="text" 
            [(ngModel)]="taskDetail.title" 
            name="title" 
            required
          >
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea 
            [(ngModel)]="taskDetail.description" 
            name="description"
            rows="4"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Status</label>
            <select 
              [(ngModel)]="taskDetail.status" 
              name="status"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div class="form-group">
            <label>Priority</label>
            <select 
              [(ngModel)]="taskDetail.priority" 
              name="priority"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Category</label>
            <select 
              [(ngModel)]="taskDetail.category" 
              name="category"
            >
              <option value="Backend">Backend</option>
              <option value="Frontend">Frontend</option>
              <option value="Bugs">Bugs</option>
              <option value="Integration">Integration</option>
            </select>
          </div>

          <div class="form-group">
            <label>Due Date</label>
            <input 
              type="date" 
              [(ngModel)]="formattedDueDate" 
              name="dueDate"
            >
          </div>
        </div>

        <div class="dialog-actions">
          <button 
            type="button" 
            mat-dialog-close 
            class="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="!isFormValid()"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .edit-task-container {
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

    .edit-task-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 5px;
      color: #5e6c84;
      font-weight: bold;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 8px;
      border: 1px solid #dfe1e6;
      border-radius: 4px;
    }

    .form-row {
      display: flex;
      gap: 15px;
    }

    .form-row .form-group {
      flex: 1;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
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

    .btn-primary {
      background-color: #0052cc;
      color: white;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class EditTaskDialogComponent implements OnInit {
  taskDetail: TaskDetail | null = null;
  formattedDueDate: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EditTaskDialogData,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EditTaskDialogComponent>
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
        // Convert ISO date to a format compatible with date input
        this.formattedDueDate = this.formatDateForInput(taskDetails.dueDate);
      },
      error: (err) => {
        console.error('Error fetching task details', err);
        this.snackBar.open('Failed to fetch task details', 'Close', { duration: 2000 });
        this.dialogRef.close();
      }
    });
  }

  formatDateForInput(isoDate: string): string {
    return new Date(isoDate).toISOString().split('T')[0];
  }

  isFormValid(): boolean {
    return !!this.taskDetail?.title && !!this.formattedDueDate;
  }

  updateTask(): void {
    if (!this.taskDetail) return;

    // Prepare the task update payload
    const updatedTask = {
      ...this.taskDetail,
      dueDate: new Date(this.formattedDueDate).toISOString()
    };

    this.http.put<TaskDetail>(`http://localhost:8080/api/tasks/${this.taskDetail.id}`, updatedTask, {
      withCredentials: true
    }).subscribe({
      next: (updatedTaskResponse) => {
        this.snackBar.open('Task updated successfully', 'Close', { duration: 2000 });
        this.dialogRef.close(updatedTaskResponse);
      },
      error: (err) => {
        console.error('Error updating task', err);
        this.snackBar.open('Failed to update task', 'Close', { duration: 2000 });
      }
    });
  }
}

export default EditTaskDialogComponent;