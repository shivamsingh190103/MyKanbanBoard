import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MemberDTO } from '../../model/interface/member.dto';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule
import { MatDatepickerModule } from '@angular/material/datepicker'; // Import MatDatepickerModule
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { ReactiveFormsModule } from '@angular/forms'; // For form control
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.scss']
})
export class UpdateTaskComponent implements OnInit {
  updateTaskForm!: FormGroup;
  private apiUrl = 'http://localhost:8080/api/projects'; // Base URL for the backend API

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.updateTaskForm = this.fb.group({
      id: [{ value: this.data.id, disabled: true }],
      name: [this.data.name, Validators.required],
      description: [this.data.description, Validators.required],
      startDate: [this.data.startDate, Validators.required],
      endDate: [this.data.endDate, Validators.required],
      members: this.fb.array([])
    });

    if (Array.isArray(this.data.members)) {
      this.data.members.forEach((member: MemberDTO) => this.addMember(member));
    }
  }

  get membersFormArray(): FormArray {
    return this.updateTaskForm.get('members') as FormArray;
  }

  addMember(member: MemberDTO = { email: '', userId: '' }): void {
    const memberForm = this.fb.group({
      email: [member.email, [Validators.required, Validators.email]],
      userId: [member.userId, Validators.required]
    });
    this.membersFormArray.push(memberForm);
  }

  removeMember(index: number): void {
    this.membersFormArray.removeAt(index);
  }

  onSave(): void {
    const updatedProject = {
      ...this.updateTaskForm.getRawValue(),
      id: this.data.id,
      members: this.membersFormArray.value,
    };
  
    this.http.put(`${this.apiUrl}/${this.data.id}`, updatedProject).subscribe({
      next: (response: any) => {
        console.log('Project updated successfully:', response);
        this.snackBar.open(response.message || 'Project updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.dialogRef.close(true); // Close dialog and pass success signal
      },
      error: (error) => {
        console.error('Error updating project:', error);
        const errorMessage = error.error?.error || 'An error occurred while updating the project.';
        this.snackBar.open(errorMessage, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
      },
    });
  }
  

  onCancel(): void {
    this.dialogRef.close(false); // Close dialog without changes
  }
}
