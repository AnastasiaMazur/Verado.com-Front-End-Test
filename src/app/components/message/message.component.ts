import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '../../models/message.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.model';
import { take } from 'rxjs/operators'
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit {
  @Input() msg: Message
  @Input('chat') chatStatus: string
  user: User
  msgInfoLoaded: boolean
  sender: User
  subs: Subscription[] = []
  @Output('onOffer') offerEmitter: EventEmitter<any> = new EventEmitter()
  @Output('onOfferAccept') offerAcceptEmitter: EventEmitter<any> = new EventEmitter()
  constructor(private authService: AuthService, private afDb: AngularFireDatabase) { }
  
  get isOwner() {
    return this.sender && this.sender.uid === this.user.uid
  }
  
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe() )
  }
  
  ngOnInit() {
    this.user = this.authService.getUser()
    this.getSender()
  }

  getSender() {
    this.subs.push(
      this.afDb.list('users', ref => ref.orderByChild('uid').equalTo(this.msg.sender))
        .valueChanges().pipe(
          take(1)
        ).subscribe(([user]: User[]) => {
          this.sender = user
          this.msgInfoLoaded = true
        })
    )
  }

  sendOffer() {
    this.offerEmitter.emit(this.sender)
  }

  acceptOffer() {
    this.offerAcceptEmitter.emit()
  }

}
