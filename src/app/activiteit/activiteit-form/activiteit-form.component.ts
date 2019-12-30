import { Component, OnInit } from '@angular/core';
import { Activiteit } from 'app/models/activiteit.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Gebruiker } from 'app/auth/models/gebruiker.model';
import { ActiviteitService } from '../activiteit.service';

@Component({
  selector: 'app-activiteit-form',
  templateUrl: './activiteit-form.component.html',
  styleUrls: ['./activiteit-form.component.scss']
})
export class ActiviteitFormComponent implements OnInit {
  isAdd: boolean = true;
  activiteitModel: Activiteit = new Activiteit();
  minDate = new Date();
  constructor(private activiteitService: ActiviteitService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    let activiteitid = this.route.snapshot.paramMap.get("activiteitid");
    if (activiteitid) {
      this.isAdd = false;
      //Get gebruiker and set model
      // this.authService.getGebruiker(gebruikerid).subscribe(g => {
      //   this.gebruikerModel = (g.data() as Gebruiker);
      //   this.gebruikerModel.id = g.id;
      // })
    }
  }

  postActiviteit() {
    if (this.isAdd) {
      this.activiteitModel.gezinid = (JSON.parse(localStorage.getItem('gebruiker')) as Gebruiker).gezinid;
      let activiteitToAdd = JSON.parse(JSON.stringify(this.activiteitModel));
      this.activiteitService.createActiviteit(activiteitToAdd).then(r => {
        this.router.navigate(['activiteit-dashboard']);
      });
    } else {
      // let gebruikerToUpdate = JSON.parse(JSON.stringify(this.gebruikerModel));
      // this.authService.updateGebruiker(gebruikerToUpdate).then(r => {
      //   this.router.navigate(['gezin-dashboard']);
      // });
    }
  }

  getActionText() {
    if (this.isAdd) {
      return "toevoegen";
    } else {
      return "wijzigen";
    }
  }
}
