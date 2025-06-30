import { Component } from '@angular/core';
import { TaskFormComponent } from "../task-form/task-form.component";
import { TaskListComponent } from '../task-list/task-list.component';
import { CommonModule } from '@angular/common';
import { TaskListService } from '../../services/task-list.service';

@Component({
  selector: 'app-layout',
  imports: [TaskFormComponent, TaskListComponent, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  constructor(public taskService: TaskListService) {
    // Initialization logic can go here if needed
  }
  // You can add any additional properties or methods needed for the layout component
  isLoading: boolean = false;   

}
