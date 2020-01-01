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
  isLoggedin = new BehaviorSubject(localStorage.getItem('gebruiker') ? true : false);

  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private firestore: AngularFirestore,
    private gezinService: GezinService,
    private router: Router
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        this.isLoggedin.next(true);
      } else {
        this.isLoggedin.next(false);
      }
    })
  }

  getGebruikers() {
    return this.firestore.collection<Gebruiker>('gebruikers').snapshotChanges();
  }

  getGebruiker(id: string) {
    return this.firestore.collection<Gebruiker>('gebruikers').doc(id).get();
  }

  getGebruikerByID(id: string) {
    return this.firestore.collection<Gebruiker>('gebruikers', ref => ref.where('id', '==', id)).valueChanges();
  }

  createGebruiker(gebruiker: Gebruiker) {
    return this.firestore.collection('gebruikers').add(gebruiker);
  }

  getGebruikersByEmail(email: string) {
    let gebruikersRef = this.firestore.collection<Gebruiker>('gebruikers', ref => ref.where('email', '==', email));
    return gebruikersRef;
  }

  updateGebruiker(gebruiker: Gebruiker) {
    //delete gebruiker.id;
    return this.firestore.collection('gebruikers').doc(gebruiker.id).update(gebruiker);
  }

  // Sign in with Facebook
  facebookAuth() {
    return this.authLogin(new auth.FacebookAuthProvider());
  }

  async login(email: string, password: string) {
    let classContext = this;
    var result = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    if (result.user.emailVerified) {
      this.getGebruikersByEmail(result.user.email).get().subscribe(gebruiker => {
        gebruiker.forEach(function (doc) {
          let updatedGebruiker = doc.data() as Gebruiker;
          localStorage.setItem('gebruiker', JSON.stringify(updatedGebruiker));

          classContext.router.navigate(['gezin-dashboard']);
        });
      });
    } else {
      this.logOut();
    }
  }

  async register(email: string, password: string) {
    let classContext = this;
    var result = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    this.sendEmailVerification();
    if (result.user) {
      this.getGebruikersByEmail(result.user.email).get().subscribe(gebruiker => {
        if (gebruiker.empty) {
          //insert gezin + gebruiker
          let addGebruiker = new Gebruiker();
          addGebruiker.isRegisteredEmail = true;
          addGebruiker.gebruikersnaam = result.user.email;
          addGebruiker.email = result.user.email;
          addGebruiker.uniqueid = result.user.uid;
          addGebruiker.isEmailVerified = result.user.emailVerified;

          let gezin = new Gezin();
          var dataGezin = JSON.parse(JSON.stringify(gezin));

          this.gezinService.createGezin(dataGezin).then(g => {
            addGebruiker.gezinid = g.id;
            var dataGebruiker = JSON.parse(JSON.stringify(addGebruiker));
            classContext.createGebruiker(dataGebruiker);
          });
        } else {
          //update gebruiker met fb uid of gezinslid dat is toegevoegd
          gebruiker.forEach(function (doc) {
            let updatedGebruiker = doc.data() as Gebruiker;
            updatedGebruiker.id = doc.id;
            updatedGebruiker.linkeduniqueIDEmail = result.user.uid;
            classContext.updateGebruiker(updatedGebruiker).then();
          });
        }
      });

      this.logOut();
    }
  }

  async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification()
    this.router.navigate(['verify-email']);
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  // Auth logic to run auth providers
  authLogin(provider) {
    //Make sure to pass in the current context so we can call class methods
    let classContext = this;
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        console.log(result);
        this.getGebruikersByEmail((result.additionalUserInfo.profile as any).email).get().subscribe(gebruiker => {
          if (gebruiker.empty) {
            //insert gezin + gebruiker
            let addGebruiker = new Gebruiker();
            addGebruiker.isRegisteredFacebook = true;
            addGebruiker.gebruikersnaam = (result.additionalUserInfo.profile as any).name;
            addGebruiker.email = (result.additionalUserInfo.profile as any).email;
            addGebruiker.uniqueid = result.user.uid;

            let gezin = new Gezin();
            var dataGezin = JSON.parse(JSON.stringify(gezin));

            this.gezinService.createGezin(dataGezin).then(g => {
              addGebruiker.gezinid = g.id;
              var dataGebruiker = JSON.parse(JSON.stringify(addGebruiker));
              classContext.createGebruiker(dataGebruiker).then();

              //add gebruiker to localstorage
              localStorage.setItem('gebruiker', JSON.stringify(addGebruiker));

              classContext.router.navigate(['/gezin-dashboard']);
            });
          } else {
            //update gebruiker met fb uid
            gebruiker.forEach(function (doc) {
              let updatedGebruiker = doc.data() as Gebruiker;
              updatedGebruiker.id = doc.id;
             
              updatedGebruiker.linkeduniqueIDFB = result.user.uid;
              classContext.updateGebruiker(updatedGebruiker).then();

              localStorage.setItem('gebruiker', JSON.stringify(updatedGebruiker));

              classContext.router.navigate(['/gezin-dashboard']);
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
    return this.isLoggedin.value;
  }

  logOut() {
    this.afAuth.auth.signOut().then(result => {
      localStorage.removeItem('gebruiker');
      localStorage.removeItem('gezinID');
      this.router.navigate(['/login']);
    });
  }
}
