import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';


import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user.model';
import { Subscription, forkJoin, Observable  } from 'rxjs';
import { Chat } from '../../models/chat.model';
import { tap, map, take, mapTo, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs'
import { appear } from '../../animations/animations'
import { AuthService } from '../../services/auth/auth.service';



@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
  animations: [appear]
})
export class ChatListComponent implements OnInit {
  user: User
  subs: Subscription[] = []
  chats$: Observable<any[]>
  chatsLength: number
  selectedChat: string
  constructor(private afDb: AngularFireDatabase, private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.user = this.authService.getUser()
    this.getAllChats()
  }

  mockData() {
    const chat: Chat = new Chat()
    chat.name = 'Public Chat 1'
    chat.status = 'public'
    chat.createdAt = new Date()
    this.afDb.list('chats').push(chat)
  }

  getAllChats() {
    this.chats$ = combineLatest(this.getPublicChats(), this.getUserChats()).pipe(
      map(([publicChats, privateChats]) => {
        let chats = []
        let privateChatObs = []
        if(privateChats.length) {
          privateChatObs = privateChats.map((item) => this.getPrivateChatCompanion(item))
        } else {
          /* create new empty chat for tiggering forkjoin */
          const chat = new Chat()
          chat.participantsStr = '0 0'
          privateChatObs.push(this.getPrivateChatCompanion(chat))
        }
        
        chats = [publicChats, privateChatObs, privateChats]
        return chats
      }),
      switchMap(([publicChats, privateChatObs, privateChats]) => {
        return forkJoin(...privateChatObs).pipe( // populate private chat companion
          mapTo([...publicChats, ...privateChats])
        )
      }),
    )
  }

  getPrivateChatCompanion(chat: Chat): Observable<any> {
    let chatCompanionUid = 
      chat.participantsStr.split(' ')
          .find(item => item != this.user.uid)

    if(!chatCompanionUid) chatCompanionUid = '0'

    return this.afDb.list('users', ref => {
      return ref.orderByChild('uid').equalTo(chatCompanionUid)
    }).valueChanges().pipe(
      take(1),
      tap(([user]: any[]) => {
        chat.companion = user
        return chat
      }),
      mapTo(chat)
    )
  }

  getUserChats(): Observable<any[]> {
    return this.afDb.list('chats')
    .snapshotChanges().pipe(
      map(actions => {
        const chats = actions.map(a => ({ key: a.key, ...a.payload.val() }))
        return  chats.filter((item: Chat) => item.participantsStr && item.participantsStr.indexOf(this.user.uid) >= 0)
      })
    )
  }

  getPublicChats(): Observable<any[]> {
    return this.afDb.list('chats', ref => {
      return ref.orderByChild('status').equalTo('public')
    })
    .snapshotChanges().pipe(
      map(actions => {
        return  actions.map(a => ({ key: a.key, ...a.payload.val() }))
      })
    )
  }
}
