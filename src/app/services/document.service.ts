import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DocumentResponse {
  documentId: number;
  documentName: string;
  customerName: string;
  documentType: string;
  linkedTo: string;
  status: string;
  addedOn: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly http = inject(HttpClient);

  getDocuments(): Observable<DocumentResponse[]> {
    return this.http.get<DocumentResponse[]>('http://localhost:5000/api/documents');
  }

  createDocument(body: DocumentSave): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/documents', body);
  }

  updateDocument(documentId: number, body: DocumentSave): Observable<void> {
    return this.http.put<void>('http://localhost:5000/api/documents/' + documentId, body);
  }

  deleteDocument(documentId: number): Observable<void> {
    return this.http.delete<void>('http://localhost:5000/api/documents/' + documentId);
  }
}

export interface DocumentSave {
  documentName: string;
  customerNumber: string;
  documentType: string;
  linkedTo: string;
  status: string;
  addedOn: string;
}
