import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Gebruiker } from '../models/gebruiker.model';
import { Router } from '@angular/router';
import { LoginRegister } from '../models/login-register.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {
  // Switch tussen login formulier en registratieformulier
  isLogin = false;
  loginRegisterModel: LoginRegister = new LoginRegister();
  passwordsNoMatch : boolean;
  loginRegisterForm: NgForm; // loginRegisterForm is nothing but the template reference of the Template Driven Form
  @ViewChild('loginRegisterForm') currentForm: NgForm;

  constructor(public authService: AuthService, private router: Router) {
    //subscribe on loggedin to redirect to dashboard
    this.authService.isLoggedin.subscribe(isLoggedIn => {
      if(isLoggedIn) {
        this.router.navigate(['/dashboard']);
      }
    })

    if (this.router.url === '/login') {
      this.isLogin = true;
    } else if (this.router.url === '/register') {
      this.isLogin = false;
    } else if (this.router.url === '/logout') {
      this.authService.logOut();
    }
   }

  ngOnInit() {
    /*this.authService.getGebruikers().subscribe(result => {
      this.gebruikers =result.map(e=> {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Gebruiker; 
      })
    });*/
  }

  fbLogin() {
    this.authService.facebookAuth().then();
  }

  postRegisterLogin() {
    console.log(this.loginRegisterModel);
    if(!this.isLogin) {
      //client side check passwords
      if(this.loginRegisterModel.password !== this.loginRegisterModel.passwordConfirm) {
       
        this.currentForm.form.controls["passwordConfirm"].setErrors({ 'incorrect': true });
      }
    }
  }

  getBtnText(): string {
    return this.isLogin ? 'Inloggen' : 'Registreren';
  }

}
