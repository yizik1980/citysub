import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { mainApiApiService } from './mainApi.service';
import { HttpResponse } from '@angular/common/http';
import { Task } from '../model/task';

export const layoutResolver: ResolveFn<boolean> = (route, state) => {
  const mainApi = inject(mainApiApiService);
  mainApi.getTasks().subscribe({
    next: (response) => {
      const {body} = response as HttpResponse< Task[]>;
      // Store tasks in session storage
      sessionStorage.setItem('tasks', JSON.stringify(body));
      // Optionally, you can also store tasks in a service or state management
      // system if needed for the application.
    },
    error: (err) => {
      console.error('Error fetching tasks:', err);
      // Handle error appropriately, e.g., redirect to an error page or show a message
    },
  });
  return true;
};
