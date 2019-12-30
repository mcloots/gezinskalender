import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { UpdateService } from './shared/update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoggedIn: boolean = false;

  constructor(public authService: AuthService, private updateService: UpdateService) {
   authService.isLoggedin.subscribe(loggedIn => {
    this.isLoggedIn = loggedIn;
   });
  }

   logout() {
    this.authService.logOut();
   }

}
