import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface StaffResponse {
  displayName: string;
  userName: string;
  jobTitle: string;
  area: string;
  status: string;
  isAdmin: boolean;
}

export interface StaffSave {
  displayName: string;
  userName: string;
  jobTitle: string;
  area: string;
  status: string;
  isAdmin: boolean;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AdministrationService {
  private readonly http = inject(HttpClient);

  getStaff(): Observable<StaffResponse[]> {
    return this.http.get<StaffResponse[]>('http://localhost:5000/api/administration');
  }

  createStaff(body: StaffSave): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/administration', body);
  }

  updateStaff(userName: string, body: StaffSave): Observable<void> {
    return this.http.put<void>('http://localhost:5000/api/administration/' + userName, body);
  }

  deleteStaff(userName: string): Observable<void> {
    return this.http.delete<void>('http://localhost:5000/api/administration/' + userName);
  }
}
