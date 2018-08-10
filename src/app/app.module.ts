import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFireStorageModule } from 'angularfire2/storage'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { LoginComponent } from './components/login/login.component';
import { ChatThreadComponent } from './components/chat-thread/chat-thread.component';
import { RoutingModule } from './routing/routing.module';
import { MessageComponent } from './components/message/message.component';
import { ModalComponent } from './components/modal/modal.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SignUpComponent } from './components/sign-up/sign-up.component'


const fireBaseConfig = {
  apiKey: "AIzaSyBiGLm5K6jinQOpAPCxxk-bpDn63eKujmQ",
  authDomain: "verado-d2c73.firebaseapp.com",
  databaseURL: "https://verado-d2c73.firebaseio.com",
  projectId: "verado-d2c73",
  storageBucket: "verado-d2c73.appspot.com",
  messagingSenderId: "144321551009"
}


@NgModule({
  declarations: [
    AppComponent,
    ChatListComponent,
    LoginComponent,
    ChatThreadComponent,
    MessageComponent,
    ModalComponent,
    SignUpComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    RoutingModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(fireBaseConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
