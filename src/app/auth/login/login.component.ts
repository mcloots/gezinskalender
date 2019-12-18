import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Gebruiker } from '../models/gebruiker.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  gebruikers: Gebruiker[];

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authService.getGebruikers().subscribe(result => {
      this.gebruikers =result.map(e=> {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Gebruiker; 
      })
    });
  }

}
