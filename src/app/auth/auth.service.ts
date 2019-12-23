import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { Gebruiker } from './models/gebruiker.model';
import { GezinService } from '../gezin/gezin.service';
import { Gezin } from '../models/gezin.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data
  isLoggedin = new BehaviorSubject(false);
  isLoggedinProp: boolean = false;

  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private firestore: AngularFirestore,
    private gezinService: GezinService,
    private router: Router
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        this.isLoggedinProp = true;
        this.isLoggedin.next(true);
      } else {
        this.isLoggedinProp = false;
        this.isLoggedin.next(false);
      }
    })
  }

  getGebruikers() {
    //collectionGroup --> query all subcollections
    return this.firestore.collectionGroup<Gebruiker>('gebruikers').snapshotChanges();
  }

  createGebruiker(gezinID: string, gebruiker: Gebruiker) {
    return this.firestore.collection('gezinnen').doc(gezinID).collection('gebruikers').add(gebruiker);
  }

  getGebruikersByEmail(email: string) {
    let gebruikersRef = this.firestore.collectionGroup<Gebruiker>('gebruikers', ref => ref.where('email', '==', email));
    return gebruikersRef;
  }

  updateGebruiker(gezinID: string, gebruiker: Gebruiker) {
    //delete gebruiker.id;
    this.firestore.collection('gezinnen').doc(gezinID).collection('gebruikers').doc(gebruiker.id).update(gebruiker);
  }

  // Sign in with Facebook
  facebookAuth() {
    return this.authLogin(new auth.FacebookAuthProvider());
  }

  // Auth logic to run auth providers
  authLogin(provider) {
    //Make sure to pass in the current context so we can call class methods
    let classContext = this;
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        console.log(result);
        this.getGebruikersByEmail(result.user.email).get().subscribe(gebruiker => {
          if (gebruiker.empty) {
            //insert gezin + gebruiker
            let addGebruiker = new Gebruiker();
            addGebruiker.gebruikersnaam = result.user.email;
            addGebruiker.email = result.user.email;
            addGebruiker.fbid = result.user.uid;

            let gezin = new Gezin();
            gezin.gebruikers = [];
            gezin.gebruikers.push(addGebruiker);
            var dataGezin = JSON.parse(JSON.stringify(gezin));
            var dataGebruiker = JSON.parse(JSON.stringify(addGebruiker));
            this.gezinService.createGezin(dataGezin).then(g => {
              classContext.createGebruiker(g.id, dataGebruiker);

              //add gebruiker to localstorage
              localStorage.setItem('gebruiker', JSON.stringify(addGebruiker));
            });
          } else {
            //update gebruiker met fb uid
            gebruiker.forEach(function (doc) {
              let updatedGebruiker = doc.data() as Gebruiker;
              updatedGebruiker.id = doc.id;
              //path to gezin
              let gezin = doc.ref.parent.parent;
              updatedGebruiker.fbid = result.user.uid;
              classContext.updateGebruiker(gezin.id, updatedGebruiker);

              localStorage.setItem('gebruiker', JSON.stringify(updatedGebruiker));
            });
          }

        });
        //result.user.uid = facebook id
        //result.user.email = email
      }).catch((error) => {
        console.log(error)
      })
  }

  isLoggedIn() {
    return this.isLoggedinProp;
  }

  logOut() {
    this.afAuth.auth.signOut().then(result => {
      localStorage.removeItem('gebruiker');
      this.router.navigate(['/login']);
    });
  }
}
