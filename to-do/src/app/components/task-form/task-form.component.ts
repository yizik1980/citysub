import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../../model/task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { TaskListService } from '../../services/task-list.service';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  constructor(private taskListService: TaskListService) {
    // Initialization logic can go here if needed
  }
  ngOnInit(): void {
    this.taskListService.selectedTask.subscribe({
      next: (task: Task | null) => {
        if (task) {
          // If a task is selected, populate the form with its details
          this.task = { ...task };
          this.isNewTask = false;
          this.isEditMode = true;
        } else {
          // Reset the form if no task is selected
          this.task = {} as Task;
          this.isNewTask = true;
          this.isEditMode = false;
        }
      },
    });
  }
  // Inputs for the task form component
  @Input() task: Task = {} as Task;
  @Input() isNewTask: boolean = true;
  @Input() isViewMode: boolean = false;
  @Input() isEditMode: boolean = false;

  @Output() addTask = new EventEmitter<Task>();
  addToDoTask() {
    if (this.isNewTask) {
      this.addTask.next(this.task);
    } else if (this.isEditMode) {
      // If it's an existing task in edit mode, call the updateTask function
      this.taskListService.updateTask(this.task);
    }
    // Reset the task object after adding or updating
    this.task = {} as Task;
  }

  cancel() {
    // Reset the task object and emit null to clear the selected task
    this.task = {} as Task;
    this.taskListService.selectedTask.next(null);
    this.isNewTask = true;
    this.isEditMode = false;
  } 
itTask() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      // If entering edit mode, emit the current task
      this.taskListService.selectedTask.next(this.task);
    } 
  } 
}
