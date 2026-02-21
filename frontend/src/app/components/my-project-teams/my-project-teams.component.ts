import { Component, OnInit, inject } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { SessionService } from '../../services/session.service';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { UpdateTaskComponent } from '../update-task/update-task.component';
import { AddMemberComponent } from '../add-member/add-member.component';
import { LogoutConfirmationDialogComponent } from '../logout-confirmation-dialog/logout-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router'; // Import Router
import { CommonModule } from '@angular/common'; // Import CommonModule for DatePipe
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-my-project-team',
  standalone: true,
  imports: [SidebarComponent, MatDialogModule, CommonModule, MatSnackBarModule], // Import MatDialogModule here
  templateUrl: './my-project-teams.component.html',
  styleUrls: ['./my-project-teams.component.css']
})
export class MyProjectTeamComponent implements OnInit {
  projects: any[] = [];
  showDeleteModal: boolean = false;
  projectToDelete: number | null = null;
  showDeleteMemberModal: boolean = false;
  memberToDelete: { projectId: number, memberId: number } | null = null;

  private http = inject(HttpClient);
  private sessionService = inject(SessionService);
  private router = inject(Router); // Inject Router service

  private dialog = inject(MatDialog); // Inject MatDialog service here
  private snackBar = inject(MatSnackBar); // Inject MatSnackBar here
  private apiUrl = 'http://localhost:8080/api/projects'; // Backend API base URL
  private memberApiUrl = 'http://localhost:8080/api/team-members';

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    const session = this.sessionService.getSession();
    if (session) {
      const userId = session.userId;

      this.http.get<any[]>(`${this.apiUrl}/${userId}`, {
        withCredentials: true
      }).subscribe({
        next: (res) => {
          console.log('Projects fetched successfully', res);
          this.projects = res;
        },
        error: (err) => {
          console.error('Error fetching projects', err);
        }
      });
    } else {
      console.error('User is not logged in');
    }
  }

  createProject(): void {
    const dialogRef = this.dialog.open(CreateProjectComponent, {
      width: '500px',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((newProject) => {
      if (newProject) {
        console.log('Project created successfully');
        this.fetchProjects();
      }
    });
  }

  editProject(projectId: number): void {
    const project = this.projects.find((p) => p.id === projectId);
    if (project) {
      const dialogRef = this.dialog.open(UpdateTaskComponent, {
        width: '400px',
        data: { ...project }
      });

      dialogRef.afterClosed().subscribe((updatedProject) => {
        if (updatedProject) {
          console.log('Project updated successfully');
          this.fetchProjects();
        }
      });
    }
  }

  addMember(project: any): void {
    const dialogRef = this.dialog.open(AddMemberComponent, {
      width: '400px',
      data: { projectId: project.id, name: project.name }
    });

    dialogRef.afterClosed().subscribe((newMember) => {
      if (newMember) {
        console.log('Member added successfully');
        this.fetchProjects();
      }
    });
  }

  deleteMember(projectId: number, memberId: number): void {
    this.showDeleteMemberModal = true;
    this.memberToDelete = { projectId, memberId };
  }

  confirmDeleteMember(): void {
    if (this.memberToDelete !== null) {
      const { projectId, memberId } = this.memberToDelete;

      this.http.delete(`${this.memberApiUrl}/${memberId}/project/${projectId}`).subscribe({
        next: () => {
          console.log('Member deleted successfully');
          this.snackBar.open('Member deleted successfully', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          this.fetchProjects();
          this.cancelDeleteMember();
        },
        error: (err) => {
          console.error('Error deleting member', err);
          let errorMessage = 'Error deleting member.';

          if (err.status === 403) {
            errorMessage = 'You do not have permission to delete this member.';
          } else if (err.status === 404) {
            errorMessage = 'Member not found or does not belong to the project.';
          } else if (err.status === 500) {
            errorMessage = 'Server error occurred. Please try again later.';
          }

          this.snackBar.open(errorMessage, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
    }
  }

  cancelDeleteMember(): void {
    this.showDeleteMemberModal = false;
    this.memberToDelete = null;
  }

  onDelete(projectId: number): void {
    this.showDeleteModal = true;
    this.projectToDelete = projectId;
  }

  confirmDelete(): void {
    if (this.projectToDelete !== null) {
      this.http.delete(`${this.apiUrl}/${this.projectToDelete}`).subscribe({
        next: (response: any) => {
          console.log(response.message || 'Project deleted successfully');
          this.snackBar.open(response.message || 'Project deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.fetchProjects();
          this.cancelDelete();
        },
        error: (err) => {
          console.error('Error deleting project', err);
          let errorMessage = 'An error occurred while deleting the project.';
          if (err.error && err.error.error) {
            errorMessage = err.error.error; // Extract error message from backend response
          }
          this.snackBar.open(errorMessage, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        },
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.projectToDelete = null;
  }

  logout(): void {
    const dialogRef = this.dialog.open(LogoutConfirmationDialogComponent, { width: '300px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User logged out');
        this.router.navigate(['/my-kanban']);
      }
    });
  }
}
