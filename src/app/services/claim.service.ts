import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ClaimResponse {
  claimNumber: string;
  customerName: string;
  claimType: string;
  status: string;
  claimDate: string;
}

@Injectable({ providedIn: 'root' })
export class ClaimService {
  private readonly http = inject(HttpClient);

  getClaims(): Observable<ClaimResponse[]> {
    return this.http.get<ClaimResponse[]>('http://localhost:5000/api/claims');
  }

  createClaim(body: ClaimSave): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/claims', body);
  }

  updateClaim(claimNumber: string, body: ClaimSave): Observable<void> {
    return this.http.put<void>('http://localhost:5000/api/claims/' + claimNumber, body);
  }

  deleteClaim(claimNumber: string): Observable<void> {
    return this.http.delete<void>('http://localhost:5000/api/claims/' + claimNumber);
  }
}

export interface ClaimSave {
  claimNumber: string;
  customerNumber: string;
  claimType: string;
  status: string;
  claimDate: string;
}
