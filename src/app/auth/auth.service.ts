import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { Gebruiker } from './models/gebruiker.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private firestore: AngularFirestore
  ) { }

  getGebruikers() {
    //collectionGroup --> query all subcollections
    return this.firestore.collectionGroup<Gebruiker>('gebruikers').snapshotChanges();
  }

  // Sign in with Facebook
  FacebookAuth() {
    return this.AuthLogin(new auth.FacebookAuthProvider());
  }  

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
        console.log('Inloggen is gelukt!')
    }).catch((error) => {
        console.log(error)
    })
  }
}
