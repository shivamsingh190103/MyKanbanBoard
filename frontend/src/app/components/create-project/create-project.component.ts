import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatButtonModule } from '@angular/material/button'; 
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule
import { ProjectService } from '../../services/project.service'; 
import { ProjectDTO } from '../../model/interface/project.dto'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule, // Include MatSelectModule for dropdown
    CommonModule
  ]
})
export class CreateProjectComponent {
  projectForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService 
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['', Validators.required], // Add status field
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.projectForm.valid) {
      const projectData: ProjectDTO = this.projectForm.value;
      this.projectService.createProject(projectData).subscribe(
        (response) => {
          console.log('Project created successfully:', response);
          this.dialogRef.close(response);  
        },
        (error) => {
          console.error('Error creating project:', error);
        }
      );
    }
  }
}
