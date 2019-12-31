import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Activiteit } from 'app/models/activiteit.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Gebruiker } from 'app/auth/models/gebruiker.model';
import { ActiviteitService } from '../activiteit.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { GezinService } from 'app/gezin/gezin.service';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-activiteit-form',
  templateUrl: './activiteit-form.component.html',
  styleUrls: ['./activiteit-form.component.scss']
})
export class ActiviteitFormComponent implements OnInit {
  isAdd: boolean = true;
  activiteitModel: Activiteit = new Activiteit();
  minDate = new Date();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  gezinsleden: string[] = [];
  gezinsledenFull: Gebruiker[] = [];
  filteredGezinsleden: Observable<string[]>;
  selectedGezinsleden: string[] = [];

  @ViewChild('gezinslidInput', { static: false }) gezinslidInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('activiteitForm') ngForm: NgForm;

  constructor(private activiteitService: ActiviteitService, private router: Router, private route: ActivatedRoute, private gezinService: GezinService) {
  }

  ngOnInit() {
    let gebruiker = JSON.parse(localStorage.getItem('gebruiker')) as Gebruiker;
    this.gezinService.getGebruikersByGezinID(gebruiker.gezinid).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Gebruiker;
        return data;
      }))
    ).subscribe(result => {
      this.gezinsledenFull = result;
    });

    this.gezinService.getGebruikersByGezinID(gebruiker.gezinid).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Gebruiker;
        return data.gebruikersnaam;
      }))
    ).subscribe(result => {
      this.gezinsleden = result;

      console.log(this.ngForm.controls);
      if (this.ngForm.controls['wie']) {
        this.filteredGezinsleden = this.ngForm.controls['wie'].valueChanges.pipe(
          startWith(null),
          map((gezinslid: string | null) => gezinslid ? this._filter(gezinslid) : this.gezinsleden.slice()));
      }
    });

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
      this.activiteitModel.onderwerpen = this.selectedGezinsleden;
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

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our gezinslid
      if ((value || '').trim()) {
        this.selectedGezinsleden.push(value.trim());
        console.log(this.selectedGezinsleden);
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.activiteitModel.wie = null;
    }
  }

  remove(gezinslid: string): void {
    const index = this.selectedGezinsleden.indexOf(gezinslid);

    if (index >= 0) {
      this.selectedGezinsleden.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedGezinsleden.push(event.option.viewValue);
    this.gezinslidInput.nativeElement.value = '';
    this.activiteitModel.wie = null;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.gezinsleden.filter(gezinslid => gezinslid.toLowerCase().indexOf(filterValue) === 0);
  }
}
