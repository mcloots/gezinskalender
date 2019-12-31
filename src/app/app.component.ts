import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { UpdateService } from './shared/update.service';
import * as firebase from 'firebase';

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

    // Enable offline support
    firebase.firestore().enablePersistence()
      .catch(function (err) {
        if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
        }
      });
}

logout() {
  this.authService.logOut();
}

}
