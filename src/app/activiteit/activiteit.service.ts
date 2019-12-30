import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Activiteit } from 'app/models/activiteit.model';

@Injectable({
  providedIn: 'root'
})
export class ActiviteitService {

  constructor(private firestore: AngularFirestore) { }

   getActiviteitenByGezinID(gezinID: string) {
    return this.firestore.collection('activiteiten', ref => ref.where('gezinid', '==', gezinID).orderBy('datum','asc')).snapshotChanges();
  }

  createActiviteit(activiteit: Activiteit) {
    return this.firestore.collection('activiteiten').add(activiteit);
  }
}
