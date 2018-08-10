import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/user.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { pick } from 'lodash'


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  signedInUser: BehaviorSubject<any> = new BehaviorSubject(null)
  constructor(private afAuth: AngularFireAuth, private router: Router, private afDb: AngularFireDatabase) {
    
  }

  login({email, password}) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    this.router.navigate(['chat'])
  }

  signOut() {
    this.afAuth.auth.signOut()
        .then(_ => this.signedInUser.next(null))
  }

  transformUser(user: any): User {
    return pick(user, ['uid', 'displayName', 'email', 'photoURL'])
  }

  async signUp(user: User): Promise<any> {
    const err: any = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password) // register user in auth
    if(err.message) {
      return Promise.reject(err.message)
    }
    
    await this.afAuth.auth.currentUser.updateProfile({
      displayName: user.displayName,
      photoURL: user.photoURL
    })
    
    this.afDb.list('users').push(this.transformUser(this.afAuth.auth.currentUser))
    return Promise.resolve()
  }
  getUser(): any {
    return this.transformUser(this.afAuth.auth.currentUser)
  }
}
