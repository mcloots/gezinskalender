import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Gebruiker } from '../models/gebruiker.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {
  // Switch tussen login formulier en registratieformulier
  isLogin = false;

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

  getBtnText(): string {
    return this.isLogin ? 'Inloggen' : 'Registreren';
  }

}
