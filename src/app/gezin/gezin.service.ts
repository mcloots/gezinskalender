import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Gezin } from '../models/gezin.model';

@Injectable({
  providedIn: 'root'
})
export class GezinService {

  constructor(private firestore: AngularFirestore) { }

  getGebruiker() {
    let gebruikerCurrent = JSON.parse(localStorage.getItem('gebruiker'));
    let gebruikerDocID = gebruikerCurrent.id;
    return this.firestore.collectionGroup('gebruikers', ref => ref.where('id', '==', gebruikerDocID));
  }
  getGezin() {
    return this.getGebruiker().get();
  }

  getGebruikersByGezinID(gezinID: string) {
    return this.firestore.collection('gebruikers', ref => ref.where('gezinid', '==', gezinID)).snapshotChanges();
  }

  getUitvoerendeGebruikersByGezinID(gezinID: string) {
    return this.firestore.collection('gebruikers', ref => ref.where('gezinid', '==', gezinID).where('isUitvoerder', '==', true).orderBy('gebruikersnaam','asc')).snapshotChanges();
  }

  createGezin(gezin: Gezin) {
    return this.firestore.collection('gezinnen').add(gezin);
  }
}
