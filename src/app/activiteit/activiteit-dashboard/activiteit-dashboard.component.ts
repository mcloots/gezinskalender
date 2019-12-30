import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activiteit } from 'app/models/activiteit.model';
import { Observable } from 'rxjs';
import { Gebruiker } from 'app/auth/models/gebruiker.model';
import { ActiviteitService } from '../activiteit.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-activiteit-dashboard',
  templateUrl: './activiteit-dashboard.component.html',
  styleUrls: ['./activiteit-dashboard.component.scss']
})
export class ActiviteitDashboardComponent implements OnInit {
  activiteiten: Observable<Activiteit[]>;

  constructor(private router: Router, private activiteitService: ActiviteitService) {
    let context = this;
    let gebruiker = JSON.parse(localStorage.getItem('gebruiker')) as Gebruiker;
    this.activiteiten = this.activiteitService.getActiviteitenByGezinID(gebruiker.gezinid).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Activiteit;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  ngOnInit() {
  }

  addActiviteit() {
    this.router.navigate(['activiteit-form']);
  }

}
