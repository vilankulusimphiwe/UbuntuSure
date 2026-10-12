import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PaymentResponse {
  receiptNumber: string;
  customerName: string;
  policyNumber: string;
  amount: number;
  method: string;
  status: string;
  paymentDate: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);

  getPayments(): Observable<PaymentResponse[]> {
    return this.http.get<PaymentResponse[]>('http://localhost:5000/api/payments');
  }

  createPayment(body: PaymentSave): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/payments', body);
  }

  updatePayment(receiptNumber: string, body: PaymentSave): Observable<void> {
    return this.http.put<void>('http://localhost:5000/api/payments/' + receiptNumber, body);
  }

  deletePayment(receiptNumber: string): Observable<void> {
    return this.http.delete<void>('http://localhost:5000/api/payments/' + receiptNumber);
  }
}

export interface PaymentSave {
  receiptNumber: string;
  policyNumber: string;
  amount: number;
  method: string;
  status: string;
  paymentDate: string;
}
