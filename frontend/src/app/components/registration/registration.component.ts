import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface OtpRequest {
  email: string;
  otp?: string;
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  otpForm!: FormGroup;
  isOtpSent: boolean = false;
  isVerified: boolean = false;
  showPassword: boolean = false;
  isLoading: boolean = false;
  isResendDisabled: boolean = false;
  resendCountdown: number = 0;
  private baseUrl = 'http://localhost:8080/api/user';
  http = inject(HttpClient);

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid && !this.isLoading) {
      this.isLoading = true;
      const registerRequest: RegisterRequest = {
        name: this.registrationForm.get('name')?.value,
        email: this.registrationForm.get('email')?.value,
        password: this.registrationForm.get('password')?.value
      };

      this.http.post(`${this.baseUrl}/register`, registerRequest, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log('Registration response:', response);
          if (response.includes('already exists') && response.includes('is verified')) {
            alert('User is already registered and verified. Please login.');
          } else if (response.includes('already exists') && response.includes('not verified')) {
            this.isOtpSent = true;
            this.startResendCountdown();
          } else {
            this.isOtpSent = true;
            this.startResendCountdown();
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          alert(error.error || 'Registration failed. Please try again.');
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
      const otpRequest: OtpRequest = {
        email: this.registrationForm.get('email')?.value,
        otp: this.otpForm.get('otp')?.value
      };

      this.http.post(`${this.baseUrl}/verifyOtp`, otpRequest, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log('OTP verification response:', response);
          if (response === 'OTP verified successfully!') {
            this.isVerified = true;
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
      const otpRequest: OtpRequest = {
        email: this.registrationForm.get('email')?.value
      };

      this.http.post(`${this.baseUrl}/sendOtp`, otpRequest, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log('Resend OTP response:', response);
          alert('OTP has been resent to your email.');
          this.startResendCountdown();
        },
        error: (error) => {
          console.error('Resend OTP error:', error);
          alert(error.error || 'Failed to resend OTP. Please try again.');
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

  // Getter methods for form controls
  get name() { return this.registrationForm.get('name'); }
  get email() { return this.registrationForm.get('email'); }
  get password() { return this.registrationForm.get('password'); }
  get otp() { return this.otpForm.get('otp'); }
}