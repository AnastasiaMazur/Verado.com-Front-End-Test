import { Component, OnInit, OnChanges, Input, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Message } from '../../models/message.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { Chat } from '../../models/chat.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { User } from '../../models/user.model';
import { AnimationBuilder, query, animate, style, AnimationPlayer, sequence } from '@angular/animations';
import { appear } from '../../animations/animations'
import { ModalComponent } from '../modal/modal.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-chat-thread',
  templateUrl: './chat-thread.component.html',
  styleUrls: ['./chat-thread.component.css'],
  animations: [appear]
})
export class ChatThreadComponent implements OnChanges {
  @Input() chat: Chat
  @ViewChild('modal') offerModal: ModalComponent
  @ViewChild('modalOfferAccept') modalOfferAccept: ModalComponent 
  chatAnimation: AnimationPlayer
  private offerForm: FormGroup
  message: Message = new Message()
  offerAttached: boolean
  offerSender: User
  messageList: Message[] = []
  user: User
  constructor(
    private afDb: AngularFireDatabase, 
    private fb: FormBuilder, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private _element: ElementRef,
    private _builder: AnimationBuilder) {
    this.initOfferForm()
  }

  ngOnInit() {
    this.user = this.authService.getUser()
    this._animationBuilder()
  }

  ngOnChanges() {
    if(!this.chat) return
    this.chatAnimation.play()
    this.messageList = []
    this.afDb.list('messages', ref => {
      return ref.orderByChild('chatRef').equalTo(this.chat.key)
    }).query.on('child_added', (snap) => {
      this.messageList.push({...snap.val(), key: snap.key})
      this.cdr.detectChanges()
    })
    
  }

  _animationBuilder() {
    this.chatAnimation = this._builder.build([
      query('.chat-messages > .feed', [
        sequence([
          animate('0.2s ease-in', style({
            opacity: 0
          })),
          style({ transform: 'scale(0) rotate(800deg)' }),
          animate('0.8s ease-in-out', style({
            transform: 'scale(1) rotate(0deg) ',
            opacity: 1,
          }))
        ])
      ])
    ]).create(this._element.nativeElement)
  }

  initOfferForm() {
    this.offerForm = this.fb.group({
      offerDescription: ['', Validators.required],
      offerAmount: [1000, Validators.minLength(100)]
    })
  }

  onOfferSending(sender: User) {
    this.offerSender = sender
    this.offerModal.open()
  }

  /* send offer and create private chat with offer message */
  sendOffer() {
    const chat: Chat = {
      participantsStr: `${this.user.uid} ${this.offerSender.uid}`,
      status: 'private',
      createdAt: new Date()
    }
    const newChatKey = this.afDb.list('chats').push(chat).key
    const offerMsg: Message = {
      offer: this.offerForm.value,
      chatRef: newChatKey,
      sender: this.offerSender.uid,
    }
    this.offerModal.close()
    this.afDb.list('messages').push(offerMsg)
  }

  onOfferAccept() {
    this.modalOfferAccept.open()
  }

  acceptOffer() {
    console.log('Offer Accepted')
    this.modalOfferAccept.close()
  }

  sendMessage() {
    this.message.sender = this.user.uid
    this.message.chatRef = this.chat.key
    this.afDb.list('messages').push(this.message)
  }

}
