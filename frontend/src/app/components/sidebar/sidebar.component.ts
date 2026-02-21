// sidebar.component.ts
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  private router = inject(Router);
  private sessionService = inject(SessionService);

  onLogout(): void {
    const confirmLogout = confirm('Are you sure you want to log out?');
    if (confirmLogout) {

      const session = this.sessionService.getSession();

      this.sessionService.clearSession();
      
      this.router.navigate(['/']);
    }
  }

  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }
}