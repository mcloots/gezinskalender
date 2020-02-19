import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activiteit } from 'app/models/activiteit.model';
import { Observable, combineLatest, of } from 'rxjs';
import { Gebruiker } from 'app/auth/models/gebruiker.model';
import { ActiviteitService } from '../activiteit.service';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { AuthService } from 'app/auth/auth.service';
import { uniq, flatten } from 'lodash';

@Component({
  selector: 'app-activiteit-dashboard',
  templateUrl: './activiteit-dashboard.component.html',
  styleUrls: ['./activiteit-dashboard.component.scss']
})
export class ActiviteitDashboardComponent implements OnInit {
  activiteiten: Observable<Activiteit[]>;
  gebruikers: Observable<Gebruiker[]>;
  joined$: Observable<any>;

  constructor(private router: Router, private activiteitService: ActiviteitService, private authService: AuthService) {
    let context = this;
    let gebruiker = JSON.parse(localStorage.getItem('gebruiker')) as Gebruiker;
    // this.activiteiten = this.activiteitService.getActiviteitenByGezinID(gebruiker.gezinid).pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data() as Activiteit;
    //     const id = a.payload.doc.id;
    //     return { id, ...data };
    //   }))
    // );
    this.joined$ = this.activiteitService.getActiviteitenByGezinID2(gebruiker.gezinid).pipe(
      map(act => act.map(a => {
        const data = a.payload.doc.data() as Activiteit;
        const id = a.payload.doc.id;
        return { id, ...data };
      })),
      switchMap(activiteiten => {
        const uitvoerderIds = uniq(activiteiten.map(bp => bp.uitvoerderid))
        return combineLatest(
          of(activiteiten),
          combineLatest(
            uitvoerderIds.map(uitvoerderId =>
              this.authService.getGebruikerByID(uitvoerderId).pipe(
                map(uitvoerders => uitvoerders[0])
              )
            )
          )
        )
      }),
      map(([activiteiten, uitvoerders]) => {
        return activiteiten.map(ac => {
          console.log(ac);
          return {
            ...ac,
            uitvoerder: uitvoerders.find(a => (a as Gebruiker).id === ac.uitvoerderid)
          }
        })
      })
    )
  }

  ngOnInit() {
  }

  addActiviteit() {
    this.router.navigate(['activiteit-form']);
  }

  convertMinuten(minuten: number) {
    if (minuten == 0) {
      return "00";
    } else {
      return minuten;
    }
  }

  calculateClasses(uitvoerderid: string) {
    let gebruiker = JSON.parse(localStorage.getItem('gebruiker')) as Gebruiker;
    if (gebruiker.id == uitvoerderid) {
      return "myActivity";
    }
  }

  editActiviteit(activiteit: Activiteit) {
    this.router.navigate(['activiteit-form', { activiteitid: activiteit.id }]);
  }

  deleteActiviteit(activiteit: Activiteit) {
    this.activiteitService.deleteActiviteit(activiteit.id);
  }

}
