import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface SearchMatch {
  kind: string;
  title: string;
  detail: string;
  link: string;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly http = inject(HttpClient);

  search(text: string): Observable<SearchMatch[]> {
    return this.http.get<SearchMatch[]>('http://localhost:5000/api/search', {
      params: { text },
    });
  }
}
