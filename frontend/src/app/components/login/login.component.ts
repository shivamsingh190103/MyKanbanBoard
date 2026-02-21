// login.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userobj = {
    username: '',
    password: ''
  };

  otpForm: FormGroup;
  isOtpVerificationRequired: boolean = false;
  isVerified: boolean = false;
  showPassword: boolean = false;
  isLoading: boolean = false;
  isResendDisabled: boolean = false;
  resendCountdown: number = 0;

  private baseUrl = 'http://localhost:8080/api/user';
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private sessionService = inject(SessionService);

  constructor() {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required]]
    });
  }

  getusername() {
    if (this.userobj.username && this.userobj.password && !this.isLoading) {
      this.isLoading = true;
      const loginRequest = {
        email: this.userobj.username,
        password: this.userobj.password
      };
  
      
      this.http.post<{
        message: string, 
        userId: number, 
        userName: string
      }>(`${this.baseUrl}/login`, loginRequest).subscribe({
        next: (response) => {
          console.log('Login response:', response);
          if (response.message.includes('verify your email')) {
            this.isOtpVerificationRequired = true;
            this.resendOtp(); // Automatically send OTP when verification is required
          } else if (response.message === 'Login successful!') {
            // Store the session with all three pieces of information
            this.sessionService.setSession({ 
              email: this.userobj.username,
              userId: response.userId,
              userName: response.userName
            }); 
            this.router.navigate(['/profile']);
          } else {
            alert(response.message);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          const errorMessage = error.error ? error.error : 'An unexpected error occurred';
          alert(`Login failed: ${errorMessage}`);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  verifyOtp() {
    if (this.otpForm.valid && !this.isLoading) {
      this.isLoading = true;
      const otpRequest = {
        email: this.userobj.username,
        otp: this.otpForm.get('otp')?.value
      };

      this.http.post(`${this.baseUrl}/verifyOtp`, otpRequest, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log('OTP verification response:', response);
          if (response === 'OTP verified successfully!') {
            this.isVerified = true;
            // After verification, try to login again
            this.getusername();
          } else {
            alert(response);
          }
        },
        error: (error) => {
          console.error('OTP verification error:', error);
          alert(error.error || 'OTP verification failed. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  resendOtp() {
    if (!this.isResendDisabled && !this.isLoading) {
      this.isLoading = true;
      const otpRequest = {
        email: this.userobj.username
      };

      this.http.post(`${this.baseUrl}/sendOtp`, otpRequest, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log('Resend OTP response:', response);
          alert('OTP has been sent to your email.');
          this.startResendCountdown();
        },
        error: (error) => {
          console.error('Resend OTP error:', error);
          alert(error.error || 'Failed to send OTP. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  private startResendCountdown() {
    this.isResendDisabled = true;
    this.resendCountdown = 30; // 30 seconds cooldown
    const timer = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        this.isResendDisabled = false;
        clearInterval(timer);
      }
    }, 1000);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Getter for OTP form control
  get otp() { return this.otpForm.get('otp'); }
}
