import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Activiteit } from 'app/models/activiteit.model';

@Injectable({
  providedIn: 'root'
})
export class ActiviteitService {

  constructor(private firestore: AngularFirestore) { }

  getActiviteit(id: string) {
    return this.firestore.collection<Activiteit>('activiteiten').doc(id).get();
  }

  deleteActiviteit(id: string) {
    return this.firestore.collection<Activiteit>('activiteiten').doc(id).delete();
  }

  getActiviteitenByGezinID(gezinID: string) {
    return this.firestore.collection<Activiteit>('activiteiten', ref => ref.where('gezinid', '==', gezinID).orderBy('datum', 'asc').orderBy('tijdstipuur', 'asc').orderBy('tijdstipminuten', 'asc')).snapshotChanges();
  }

  getActiviteitenByGezinID2(gezinID: string) {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    return this.firestore.collection<Activiteit>('activiteiten', ref => ref.where('gezinid', '==', gezinID).where('datumjs', '>=', date.getTime()).orderBy('datumjs', 'asc').orderBy('tijdstipuur', 'asc').orderBy('tijdstipminuten', 'asc')).snapshotChanges();
  }

  createActiviteit(activiteit: Activiteit) {
    return this.firestore.collection('activiteiten').add(activiteit);
  }
}
