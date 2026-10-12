import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ReportResponse {
  reportName: string;
  description: string;
  category: string;
  lastRun: string;
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);

  getReports(): Observable<ReportResponse[]> {
    return this.http.get<ReportResponse[]>('http://localhost:5000/api/reports');
  }
}
