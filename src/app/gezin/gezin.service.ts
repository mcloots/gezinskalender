import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Gezin } from '../models/gezin.model';

@Injectable({
  providedIn: 'root'
})
export class GezinService {

  constructor(private firestore: AngularFirestore) { }

  createGezin(gezin: Gezin) {
    return this.firestore.collection('gezinnen').add(gezin);
  }
}
