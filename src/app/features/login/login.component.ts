import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})

export class Login{

  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  // ngModel keeps this updated.
  UserName = '';
  Password = '';
  // True when the checkbox is ticked.
  RememberMe = false;
  showPassword = false;

  signIn(): void {
    this.loginService.login(this.UserName, this.Password, this.RememberMe).subscribe({
      next: (loginResponse) => {
        // loginResponse is the employee JSON from the API.
        // Save it before opening the dashboard, so the header can show the name.
        this.loginService.saveForHeader(loginResponse);
        void this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        // The API rejected the username or password. Stay on the login page.
      },
    });
  }
}



