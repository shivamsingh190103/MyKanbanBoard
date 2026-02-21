import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MemberService } from '../../services/addmember.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AddMemberDTO } from '../../model/interface/addmember.dto';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css'],
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    CommonModule
  ],
})
export class AddMemberComponent {
  addMemberForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private memberService: MemberService,
    private snackBar: MatSnackBar
  ) {
    this.addMemberForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }


onSave(): void {
  if (this.addMemberForm.valid) {
    const memberData: AddMemberDTO = { emails: [this.addMemberForm.getRawValue().email] };
    this.memberService.addMember(this.data.projectId, memberData).subscribe({
      next: (response) => {
        console.log('Member added successfully:', response);
        const config: MatSnackBarConfig = {
          duration: 3000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'  // Position the snackbar at the top
        };
        this.snackBar.open(response.message, 'Close', config);
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Error adding member:', error);
        const config: MatSnackBarConfig = {
          duration: 5000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top'  // Position the snackbar at the top
        };
        this.snackBar.open('User not found', 'Close', config);
      }
    });
  }
}

}
