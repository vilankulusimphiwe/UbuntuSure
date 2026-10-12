import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface QuoteResponse {
  quoteNumber: string;
  customerName: string;
  product: string;
  premium: number;
  status: string;
  quoteDate: string;
}

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly http = inject(HttpClient);

  getQuotes(): Observable<QuoteResponse[]> {
    return this.http.get<QuoteResponse[]>('http://localhost:5000/api/quotes');
  }

  createQuote(body: QuoteSave): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/quotes', body);
  }

  updateQuote(quoteNumber: string, body: QuoteSave): Observable<void> {
    return this.http.put<void>('http://localhost:5000/api/quotes/' + quoteNumber, body);
  }

  deleteQuote(quoteNumber: string): Observable<void> {
    return this.http.delete<void>('http://localhost:5000/api/quotes/' + quoteNumber);
  }
}

export interface QuoteSave {
  quoteNumber: string;
  customerNumber: string;
  product: string;
  premium: number;
  status: string;
  quoteDate: string;
}
