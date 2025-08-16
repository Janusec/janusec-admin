import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, Input } from '@angular/core';
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { Server } from '../models/ssh';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

declare var require: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-web-ssh',
  imports: [
    FormsModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './web-ssh.html',
  styleUrl: './web-ssh.css'
})
export class WebSSH {
  @Input() server: Server;
  public term = new Terminal();
  @ViewChild('terminalDiv') terminalDiv!: ElementRef;
  constructor() {
    this.server = new Server("127.0.0.1", "22", "root", "");
  }

  ngOnInit() { }

  /*
  Before test this function in dev mode, 
  the upgrader configuration (in Application Gateway) is required:   
  upgrader := websocket.Upgrader{		
    CheckOrigin: func(r *http.Request) bool {
    return true
    }
  }
  */
  SSHConnect() {
    var loc = window.location;
    var ws_url;
    if (loc.protocol === "https:") {
      ws_url = "wss://";
    } else {
      ws_url = "ws://";
    }
    ws_url += loc.host + "/janusec-admin/webssh";
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
    this.term = new Terminal({
      rows: 40,
      cols: 120
    });
    this.term.open(this.terminalDiv.nativeElement);
  }
}
