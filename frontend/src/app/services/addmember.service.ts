import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AddMemberDTO } from '../model/interface/addmember.dto';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = 'http://localhost:8080/api/projects'; // Your base URL for projects

  constructor(private http: HttpClient) {}

  addMember(projectId: number, memberData: AddMemberDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addmember/${projectId}`, memberData).pipe(
      catchError(error => {
        let errorMsg = 'An error occurred';
        if (error.status === 404) {
          errorMsg = 'User not found';
        } else if (error.status === 400) {
          errorMsg = 'Invalid email format';
        } else if (error.status === 409) {
          errorMsg = 'User is already a team member';
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
