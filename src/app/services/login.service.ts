import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Expected shape of the JSON returned by POST /api/auth/login.
export interface LoginResponse {
  userName: string;
  displayName: string;
  firstName: string;
  jobTitle: string;
}

// Where the signed-in employee is kept in this browser tab.
// This is the name and job title for the header. It is not a token.
const HEADER_USER_KEY = 'ubuntusure.headerUser';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly http = inject(HttpClient);

  // Filled after sign-in, and filled again from storage when the page loads.
  loginResponse: LoginResponse | null = this.readHeaderUser();

  login(userName: string, password: string, rememberMe = false): Observable<LoginResponse> {
    const loginRequest = { userName, password };

    return this.http.post<LoginResponse>('http://localhost:5000/api/auth/login', loginRequest);
  }

  // The login page calls this after the API accepts the password.
  saveForHeader(loginResponse: LoginResponse): void {
    this.loginResponse = loginResponse;

    const savedText = JSON.stringify(loginResponse);
    sessionStorage.setItem(HEADER_USER_KEY, savedText);
  }

  // Used when the header is created, including after a refresh.
  readHeaderUser(): LoginResponse | null {
    const savedText = sessionStorage.getItem(HEADER_USER_KEY);

    if (!savedText) {
      return null;
    }

    return JSON.parse(savedText) as LoginResponse;
  }

  logout(): void {
    this.loginResponse = null;
    sessionStorage.removeItem(HEADER_USER_KEY);
  }
}
