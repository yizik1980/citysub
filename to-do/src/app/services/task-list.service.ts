import { Injectable } from '@angular/core';
import { Task } from '../model/task';
import { mainApiApiService } from './mainApi.service';
import { Observable, Subject, tap } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TaskListService {
  // Using a Set to avoid duplicate tasks
  // and to ensure unique task names.
  private tasks: Set<Task> = new Set<Task>();
  public selectedTask = new Subject<Task | null>();
  constructor(private apiService: mainApiApiService) {
    const sesstionTasks = sessionStorage.getItem('tasks');
    if (sesstionTasks) {
      const parsedTasks: Task[] = JSON.parse(sesstionTasks);
      this.tasks = new Set(parsedTasks);
    }
  }

  getTasks(): Task[] {
    return Array.from(this.tasks);
  }
  addTask(task: Task): void {
    this.apiService.addTask(task as Task).subscribe({
      next: (response) => {
        console.log('Task added successfully:', response);
        this.tasks.add(task as Task);
        // Update session storage with the new task
        sessionStorage.setItem('tasks', JSON.stringify(Array.from(this.tasks)));
      },
      error: (error) => {
        console.error('Error adding task:', error);
      },
    });
  }
  removeTask(task: Task): Observable<any> {
    return this.apiService.deleteTask(task.id).pipe(
      tap(() => {
        this.tasks.delete(task);
        sessionStorage.setItem('tasks', JSON.stringify(Array.from(this.tasks)));
      })
    );
  }
  updateTask(updatedTask: Task): Observable<HttpResponse<Task>> {
    return this.apiService.updateTask(updatedTask).pipe(
      tap((response) => {
        console.log('Task updated successfully:', response);
        // Remove the old task and add the updated one
        if(response.status === 200) {
          this.tasks.delete(updatedTask);
          this.tasks.add(updatedTask);
          // Update session storage with the updated task
          sessionStorage.setItem('tasks', JSON.stringify(Array.from(this.tasks)));
        }
      })
    );
  }
}
