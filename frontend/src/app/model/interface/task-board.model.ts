// src/app/models/task-board.model.ts
export interface Task {
    id: number;
    title: string;
    status: string;
    dueDate: string;
    priority: string;
    assignedToId: number;
    category: string; // Optional property for task type (category)
  }
  
  export interface Project {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    tasks: Task[];
  }
  
  export interface TaskSection {
    title: string;
    tasks: Task[];
  }
  