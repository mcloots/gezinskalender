import { Component, OnInit } from '@angular/core';
import { Gebruiker } from 'app/auth/models/gebruiker.model';
import { AuthService } from 'app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gezinslid-form',
  templateUrl: './gezinslid-form.component.html',
  styleUrls: ['./gezinslid-form.component.scss']
})
export class GezinslidFormComponent implements OnInit {
  gebruikerModel: Gebruiker = new Gebruiker();
  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  postGezinslid() {
    this.gebruikerModel.gezinid = (JSON.parse(localStorage.getItem('gebruiker')) as Gebruiker).gezinid;
    let gebruikerToAdd = JSON.parse(JSON.stringify(this.gebruikerModel));
    this.authService.createGebruiker(gebruikerToAdd).then(r => {
      this.router.navigate(['gezin-dashboard']);
    });
  }
}
