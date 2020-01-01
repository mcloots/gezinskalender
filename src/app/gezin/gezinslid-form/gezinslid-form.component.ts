import { Component, OnInit } from '@angular/core';
import { Gebruiker } from 'app/auth/models/gebruiker.model';
import { AuthService } from 'app/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gezinslid-form',
  templateUrl: './gezinslid-form.component.html',
  styleUrls: ['./gezinslid-form.component.scss']
})
export class GezinslidFormComponent implements OnInit {
  isAdd: boolean = true;
  gebruikerModel: Gebruiker = new Gebruiker();
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    let gebruikerid = this.route.snapshot.paramMap.get("gebruikerid");
    if (gebruikerid) {
      this.isAdd = false;
      //Get gebruiker and set model
      this.authService.getGebruiker(gebruikerid).subscribe(g => {
        this.gebruikerModel = (g.data() as Gebruiker);
        this.gebruikerModel.id = g.id;
      })
    }
  }

  postGezinslid() {
    if (this.isAdd) {
      this.gebruikerModel.gezinid = (JSON.parse(localStorage.getItem('gebruiker')) as Gebruiker).gezinid;
      let gebruikerToAdd = JSON.parse(JSON.stringify(this.gebruikerModel));
      this.authService.createGebruiker(gebruikerToAdd).then(r => {
        //update so we set id as property on document
        gebruikerToAdd.id = r.id;
        this.authService.updateGebruiker(gebruikerToAdd).then(r => {
          this.router.navigate(['gezin-dashboard']);
        });
      });
    } else {
      let gebruikerToUpdate = JSON.parse(JSON.stringify(this.gebruikerModel));
      this.authService.updateGebruiker(gebruikerToUpdate).then(r => {
        this.router.navigate(['gezin-dashboard']);
      });
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
