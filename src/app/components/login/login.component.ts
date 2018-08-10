import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.initLoginForm()
  }

  ngOnInit() {
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  private submit(): void {
    if(this.loginForm.invalid) {
      return
    }

    this.authService.login(this.loginForm.value)
  }

  signOut() {
    this.authService.signOut()
  }

}
