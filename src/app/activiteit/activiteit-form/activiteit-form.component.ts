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
import { filter } from 'rxjs-compat/operator/filter';

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

  uren: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  minuten: number[] = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  @ViewChild('gezinslidInput', { static: false }) gezinslidInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('activiteitForm') ngForm: NgForm;

  constructor(private activiteitService: ActiviteitService, private router: Router, private route: ActivatedRoute, private gezinService: GezinService) {
    this.activiteitModel.tijdstipuur = 12;
    this.activiteitModel.tijdstipminuten = 0;
  }

  ngOnInit() {
    let gebruiker = JSON.parse(localStorage.getItem('gebruiker')) as Gebruiker;
    this.gezinService.getUitvoerendeGebruikersByGezinID(gebruiker.gezinid).pipe(
      map(actions => actions.map(a => {
        let data = a.payload.doc.data() as Gebruiker;
        data.id = a.payload.doc.id;
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
      //Get activiteit and set model
      this.activiteitService.getActiviteit(activiteitid).subscribe(g => {
        this.activiteitModel = (g.data() as Activiteit);
        this.activiteitModel.id = g.id;
        this.selectedGezinsleden = this.activiteitModel.onderwerpen;
      })
    }
  }

  postActiviteit() {
    console.log(this.activiteitModel);
    this.activiteitModel.onderwerpen = this.selectedGezinsleden;
    this.activiteitModel.gezinid = (JSON.parse(localStorage.getItem('gebruiker')) as Gebruiker).gezinid;
    if (typeof this.activiteitModel.datum.getTime === 'function') {
      this.activiteitModel.datumjs = this.activiteitModel.datum.getTime();
    }
    if (this.isAdd) {

      let activiteitToAdd = JSON.parse(JSON.stringify(this.activiteitModel));
      this.activiteitService.createActiviteit(activiteitToAdd).then(r => {
        this.router.navigate(['activiteit-dashboard']);
      });
    } else {
      let activiteitToUpdate = JSON.parse(JSON.stringify(this.activiteitModel));
      this.activiteitService.updateActiviteit(activiteitToUpdate).then(r => {
        this.router.navigate(['activiteit-dashboard']);
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
