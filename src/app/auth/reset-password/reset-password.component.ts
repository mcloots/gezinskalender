import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  email:string = "";

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  resetPassword() {
    this.authService.sendPasswordResetEmail(this.email).then(r => {
      this.router.navigate(['/login']);
    });
  }

}
