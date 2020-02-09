import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
//import { WebsocketService } from '../websocket.service'

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-webssh',
  templateUrl: './webssh.component.html',
  styleUrls: ['./webssh.component.css'],
  //providers: [WebsocketService]
})
export class WebsshComponent implements OnInit {
  public term: Terminal;  
  @ViewChild('terminalDiv') terminalDiv: ElementRef;
  constructor() {}
  /*
  constructor(private wsService: WebsocketService) {
        wsService.messages.subscribe(msg => {
        console.log("Response from websocket: " + msg.message);
        this.term.write(msg.message);
      });
   }

   private message = {
    message: "this is a test message"
   };

  public sendMsg() {
    console.log("new message from client to websocket: ", this.message);
    this.wsService.messages.next(this.message);
  }
  */
  ngOnInit() {
  }  

  ngAfterViewInit() {
    this.term = new Terminal();
    this.term.open(this.terminalDiv.nativeElement);
    const socket = new WebSocket('ws://websocket.janusec.com/echo');
    const attachAddon = new AttachAddon(socket);
    // Attach the socket to term
    this.term.loadAddon(attachAddon);
    /*
    this.term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    this.term.onKey(e => {
        console.log("Key:", e.domEvent.keyCode);
        const printable = !e.domEvent.altKey && !e.domEvent.shiftKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;
        if (e.domEvent.keyCode === 13) {
            this.term.write('\r\n$ ');
        } 
        else if(e.domEvent.keyCode === 8) {
            this.term.write('\b \b');
        } else if(e.domEvent.keyCode === 127) {
            this.term.write(' \b');
        }else if (printable) {
            this.term.write(e.key);
        }
    });
    */

  }
}
