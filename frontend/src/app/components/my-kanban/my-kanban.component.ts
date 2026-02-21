// my-kanban.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-kanban',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './my-kanban.component.html',
  styleUrl: './my-kanban.component.css'
})
export class MyKanbanComponent {
  features = [
    {
      icon: '📋',
      title: 'Task Management',
      description: 'Organize tasks across different stages with our intuitive board layout'
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time updates and task assignments'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Visualize your workflow and track project progress effortlessly'
    },
    {
      icon: '🎯',
      title: 'Priority Management',
      description: 'Set and adjust task priorities to stay focused on what matters most'
    }
  ];
}