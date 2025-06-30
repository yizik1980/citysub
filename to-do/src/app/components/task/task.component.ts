import { Component, Input } from '@angular/core';
import { Task } from '../../model/task';
import { CommonModule } from '@angular/common';
import { TaskListService } from '../../services/task-list.service';

@Component({
  selector: 'app-task',
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  constructor(private taskListService: TaskListService) {
    // Initialization logic can go here if needed  
  }
  @Input()
  task: Task = null as any;
  @Input()
  showDetails: boolean = false;
  @Input()
  showActions: boolean = true;

  editTask(task: Task) {
    this.taskListService.selectedTask.next(task);
  }
  deleteTask(task: Task) {
    this.taskListService.removeTask(task).subscribe({
      next: (response) => {
        console.log('Task deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      },
    });;
    
  }
}
