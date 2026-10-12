import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PolicyResponse {
  policyNumber: string;
  customerName: string;
  product: string;
  premium: number;
  status: string;
  renewalDate: string;
}

@Injectable({ providedIn: 'root' })
export class PolicyService {
  private readonly http = inject(HttpClient);

  getPolicies(): Observable<PolicyResponse[]> {
    return this.http.get<PolicyResponse[]>('http://localhost:5000/api/policies');
  }

  createPolicy(body: PolicySave): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/policies', body);
  }

  updatePolicy(policyNumber: string, body: PolicySave): Observable<void> {
    return this.http.put<void>('http://localhost:5000/api/policies/' + policyNumber, body);
  }

  deletePolicy(policyNumber: string): Observable<void> {
    return this.http.delete<void>('http://localhost:5000/api/policies/' + policyNumber);
  }
}

export interface PolicySave {
  policyNumber: string;
  customerNumber: string;
  product: string;
  premium: number;
  status: string;
  renewalDate: string;
}
