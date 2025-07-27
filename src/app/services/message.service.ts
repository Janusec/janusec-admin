import { Injectable, signal } from '@angular/core';
import { v7 as uuidv7 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messageCount = 0;
  private messages = signal<Message[]>([]);
  public messages$ = this.messages.asReadonly();

  addSuccessMessage(msg: string) {
    this.messageCount++;
    this.messages.update(messages => [...messages, {
      id: uuidv7(),
      type: 'success',
      content: msg
    }]);
  }

  addWarnMessage(msg: string) {
    this.messageCount++;
    this.messages.update(messages => [...messages, {
      id: uuidv7(),
      type: 'warn',
      content: msg
    }]);
  }

  removeMessage(id: string) {
    this.messages.update(messages =>
      messages.filter(msg => msg.id !== id)
    );
  }

  clear() {
    this.messages.set([]);
    this.messageCount = 0;
  }

  constructor() { }

}

export interface Message {
  id: string;
  type: 'success' | 'warn';
  content: string;
}