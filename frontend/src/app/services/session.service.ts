// session.service.ts
import { Injectable } from '@angular/core';

interface SessionData {
  userId: number;
  email: string;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private SESSION_KEY = 'user_session';

  // Store session data
  setSession(data: SessionData) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(data));
  }

  // Retrieve session data
  getSession(): SessionData | null {
    const sessionData = localStorage.getItem(this.SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  }

  // Clear session
  clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getSession() !== null;
  }
}