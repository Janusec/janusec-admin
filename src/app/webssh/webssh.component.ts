import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Terminal } from 'xterm';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-webssh',
  templateUrl: './webssh.component.html',
  styleUrls: ['./webssh.component.css'],
  
})
export class WebsshComponent implements OnInit {
  public term: Terminal;  
  @ViewChild('terminal') terminalDiv: ElementRef;
  constructor() { }

  ngOnInit() {
    this.term = new Terminal();
    this.term.open(this.terminalDiv.nativeElement);
    this.term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
  }
}
