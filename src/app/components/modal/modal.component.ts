import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  exportAs: 'CustomModal'
})
export class ModalComponent implements OnInit {
  isOpen: boolean
  constructor() { }

  ngOnInit() {
    
  }

  open() {
    this.isOpen = true
  }

  close() {
    this.isOpen = false
  }
}
