import { Component, OnInit, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, of, from } from 'rxjs';
import { map, tap } from 'rxjs/operators'
import { FirebaseAuth } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';


@Injectable({
  providedIn: 'root'
})
export class RouterGuardComponent implements OnInit, CanActivate {

  constructor(private auth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
  }

  canActivate(): Observable<boolean>{
    return this.auth.authState.pipe(
      map(authState => !!authState),
      tap((isAuth: boolean) => {
        return isAuth
      })
    )
  }

}
