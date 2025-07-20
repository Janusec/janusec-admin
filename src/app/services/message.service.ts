import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messageCount = 0;
  messages: Message[] = [];

  addSuccessMessage(msg: string) {
    this.messageCount++;
    this.messages.push({
      id: this.messageCount + 1,
      type: 'success',
      content: msg
    });
  }

  addWarnMessage(msg: string) {
    this.messageCount++;
    this.messages.push({
      id: this.messageCount + 1,
      type: 'warn',
      content: msg
    });
  }

  removeMessage(id: number) {
    this.messages = this.messages.filter(msg => msg.id !== id);
  }

  clear() {
    this.messages = [];
    this.messageCount = 0;
  }

  constructor() { }

}

export interface Message {
  id: number;
  type: 'success' | 'warn';
  content: string;
}