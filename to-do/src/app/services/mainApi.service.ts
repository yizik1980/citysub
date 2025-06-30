import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root',
})
export class mainApiApiService {
  http = inject(HttpClient);
  public getTasks(): Observable<HttpResponse<Task[]>> {
    return this.http.get<HttpResponse<Task[]>>(`${environment.apiUrl}/tasks`);
  }
  public getTaskById(id: string): Observable<HttpResponse<Task>> {
    return this.http.get<HttpResponse<Task>>(
      `${environment.apiUrl}/tasks/${id}`
    );
  }

  public addTask(task: Task): Observable<any> {
    return this.http.post(`${environment.apiUrl}/tasks`, task);
  }

  public updateTask(task: Task): Observable<HttpResponse<Task>> {
    return this.http.put<HttpResponse<Task>>(`${environment.apiUrl}/tasks/${task.id}`, task);
  }

  public deleteTask(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/tasks/${id}`);
  }
}
