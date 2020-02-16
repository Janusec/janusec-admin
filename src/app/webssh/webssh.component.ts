import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, Input } from '@angular/core';
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { Server } from '../models';
//import * as crypto from 'crypto';
declare var require: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-webssh',
  templateUrl: './webssh.component.html',
  styleUrls: ['./webssh.component.css'],
  //providers: [WebsocketService]
})
export class WebsshComponent implements OnInit {
  @Input() server: Server;
  public term: Terminal;  
  @ViewChild('terminalDiv') terminalDiv: ElementRef;
  constructor() {
    this.server = new Server("127.0.0.1", "22", "root", ""); 
  }
  
  ngOnInit() {   }  

  SSHConnect() {
    var loc = window.location;
    var ws_url;
    if (loc.protocol === "https:") {
        ws_url = "wss://";
    } else {
        ws_url = "ws://";
    }
    ws_url += loc.host + "/janusec-admin/webssh";    
    //var ws_url="ws://192.168.100.107/janusec-admin/webssh";
    this.term.reset();
    const socket = new WebSocket(ws_url);
    const attachAddon = new AttachAddon(socket);
    this.term.loadAddon(attachAddon);  
    let self = this;
    socket.onopen = function () {
        socket.send(JSON.stringify(self.server));
    }
  }

  ngAfterViewInit() {
    this.term = new Terminal();
    this.term.open(this.terminalDiv.nativeElement);
  }
}
