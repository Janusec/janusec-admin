import { Component, Inject, OnInit } from '@angular/core';
import { Cookie, CookieType } from '../models';
import { Router, ActivatedRoute } from '@angular/router';
import { RPCService } from '../rpc.service';
import { MessageService } from '../message.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ICookie {
  cookie: Cookie
}

@Component({
  selector: 'app-cookie-dialog',
  templateUrl: './cookie-dialog.component.html',
  styleUrls: ['./cookie-dialog.component.css']
})

export class CookieDialogComponent {

  cookie: Cookie;
  cookie_type = CookieType;
  enum_cookie_type_values = [];

  constructor(private route: ActivatedRoute,
    public rpcService: RPCService,
    private router: Router,
    private msgService: MessageService,
    public dialogRef: MatDialogRef<CookieDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICookie) {
    this.cookie = data.cookie;
    this.enum_cookie_type_values = Object.values(CookieType).filter(f => !isNaN(Number(f)));
  }

  setCookie() {
    let self = this;
    if (this.cookie.id == '0') {
      this.rpcService.getResponse('update_cookie', function (obj: Cookie) {
        self.cookie = obj;
      }, this.cookie.id, this.cookie);
    }
    this.dialogRef.close();
  }

}

