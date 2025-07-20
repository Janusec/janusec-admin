import { Component } from '@angular/core';
import { MessageService } from '../services/message.service';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-messages',
  imports: [
    MatList,
    MatIcon,
    MatListItem
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages {
  constructor(public msgService: MessageService) { }

  removeMessage(id: number) {
    this.msgService.removeMessage(id);
  }
}
