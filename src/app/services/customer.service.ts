import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// One customer from GET /api/customers.
// The names match the JSON the API will send back.
export interface CustomerResponse {
  customerNumber: string;
  customerName: string;
  customerType: string;
  town: string;
  policyCount: number;
  status: string;
  memberSince: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly http = inject(HttpClient);

  // Ask SQL, through the API, for every customer row and get has no request body
  getCustomers(): Observable<CustomerResponse[]> {
    return this.http.get<CustomerResponse[]>('http://localhost:5000/api/Customers');
  }

  createCustomer(body: CustomerResponse): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/customers', body);
  }

  updateCustomer(customerNumber: string, body: CustomerResponse): Observable<void> {
    return this.http.put<void>('http://localhost:5000/api/customers/' + customerNumber, body);
  }

  deleteCustomer(customerNumber: string): Observable<void> {
    return this.http.delete<void>('http://localhost:5000/api/customers/' + customerNumber);
  }
}