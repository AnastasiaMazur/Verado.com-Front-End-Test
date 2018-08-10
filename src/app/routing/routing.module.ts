import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router'
import { LoginComponent } from '../components/login/login.component';
import { RouterGuardComponent } from '../components/router-guard/router-guard.component';
import { ChatListComponent } from '../components/chat-list/chat-list.component';
import { SignUpComponent } from '../components/sign-up/sign-up.component';


const ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'chat', component: ChatListComponent, canActivate: [RouterGuardComponent]},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignUpComponent}
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(ROUTES)
  ],
  exports: [RouterModule],
  declarations: [],
  
})
export class RoutingModule { }
