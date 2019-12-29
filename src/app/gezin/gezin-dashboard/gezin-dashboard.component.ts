import { Component, OnInit } from '@angular/core';
import { GezinService } from '../gezin.service';
import { Gezin } from 'app/models/gezin.model';

@Component({
  selector: 'app-gezin-dashboard',
  templateUrl: './gezin-dashboard.component.html',
  styleUrls: ['./gezin-dashboard.component.scss']
})
export class GezinDashboardComponent implements OnInit {
mijnGezin : Gezin;

  constructor(private gezinService: GezinService) {
    let context = this;
    this.gezinService.getGezin().subscribe(gebruiker => {
      gebruiker.forEach(function (doc) {
        if(!gebruiker.empty) {
          let gezin = doc.ref.parent.parent;
          gezin.get().then(g => {
            let gezin2 = g.data() as Gezin;
            context.mijnGezin = gezin2;
          })
        }
      });
    });
   }

  ngOnInit() {
  }

}
