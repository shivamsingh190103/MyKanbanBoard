import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  resetForm: FormGroup;
  isOtpSent: boolean = false;
  isLoading: boolean = false;
  isResendDisabled: boolean = false;
  resendCountdown: number = 0;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  private baseUrl = 'http://localhost:8080/api/user';
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  private passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  sendOtp() {
    if (this.email?.valid && !this.isLoading) {
      this.isLoading = true;
      const payload = { email: this.email?.value };

      this.http.post(`${this.baseUrl}/sendOtp`, payload, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log("OTP sent successfully:", response);
          this.isOtpSent = true;
          this.startResendCountdown();
          alert('OTP has been sent to your email.');
        },
        error: (error) => {
          console.error('Failed to send OTP:', error);
          alert(error.error || 'Failed to send OTP. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  resetPassword() {
    if (this.resetForm.valid && !this.isLoading) {
      this.isLoading = true;
      const resetRequest = {
        email: this.email?.value,
        otp: this.otp?.value,
        newPassword: this.newPassword?.value
      };

      this.http.post(`${this.baseUrl}/reset-password`, resetRequest, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log("Password reset successful:", response);
          alert('Password has been reset successfully!');
          this.router.navigate(['/My-Kanban']);
        },
        error: (error) => {
          console.error('Password reset failed:', error);
          alert(error.error || 'Failed to reset password. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  private startResendCountdown() {
    this.isResendDisabled = true;
    this.resendCountdown = 30;
    const timer = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        this.isResendDisabled = false;
        clearInterval(timer);
      }
    }, 1000);
  }

  togglePasswordVisibility(field: 'new' | 'confirm') {
    if (field === 'new') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Getters for form controls
  get email() { return this.resetForm.get('email'); }
  get otp() { return this.resetForm.get('otp'); }
  get newPassword() { return this.resetForm.get('newPassword'); }
  get confirmPassword() { return this.resetForm.get('confirmPassword'); }
}