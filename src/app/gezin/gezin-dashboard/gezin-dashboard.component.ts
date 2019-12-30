import { Component, OnInit } from '@angular/core';
import { GezinService } from '../gezin.service';
import { Gezin } from 'app/models/gezin.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Gebruiker } from 'app/auth/models/gebruiker.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gezin-dashboard',
  templateUrl: './gezin-dashboard.component.html',
  styleUrls: ['./gezin-dashboard.component.scss']
})
export class GezinDashboardComponent implements OnInit {
  mijnGezin: Gezin;
  gebruikers: Observable<Gebruiker[]>;

  constructor(private gezinService: GezinService, private router: Router) {
    let context = this;
    let gebruiker = JSON.parse(localStorage.getItem('gebruiker')) as Gebruiker;
    this.gebruikers = this.gezinService.getGebruikersByGezinID(gebruiker.gezinid).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Gebruiker;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addGezinslid() {
    this.router.navigate(['gezinslid-form']);
  }

  ngOnInit() {
  }

}
