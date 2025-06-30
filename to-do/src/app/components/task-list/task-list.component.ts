import { Component, Input } from '@angular/core';
import { Task } from '../../model/task';
import { TaskComponent } from '../task/task.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  imports: [TaskComponent,CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  @Input()
  tasks: Task[] = []; // Replace 'any' with the actual type of your tasks

}
