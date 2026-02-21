import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectDTO } from '../model/interface/project.dto'; // Your DTO interface

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080/api/projects'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  createProject(projectData: ProjectDTO): Observable<any> {
    return this.http.post(this.apiUrl, projectData, { withCredentials: true });
  }
}
