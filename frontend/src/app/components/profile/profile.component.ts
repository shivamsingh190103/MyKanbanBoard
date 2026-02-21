// profile.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserProfileDTO } from './user-profile.dto';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router'; // Import Router


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfileDTO = {
    email: '',
    name: '',
    totalProjects: 0,
    totalTasks: 0,
    totalActiveTasks: 0,
    totalDoneTasks: 0
  };

  private http = inject(HttpClient);
  private sessionService = inject(SessionService);
  private router = inject(Router); // Inject Router


  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const session = this.sessionService.getSession();
    if (session) {
    
      
      this.http.get<UserProfileDTO>('http://localhost:8080/api/user/profile', {
        withCredentials: true 
      }).subscribe({
        next: (res) => {
          console.log('User profile: ', res);
          this.userProfile = res;
        },
        error: (err) => {
          console.error('Error fetching profile', err);
          
          if (err.status === 401) {
            this.router.navigate(['/login']);

          }
        }
      });
    } else {
      console.error('User is not logged in');

      this.router.navigate(['/login']);

    }
  }
}