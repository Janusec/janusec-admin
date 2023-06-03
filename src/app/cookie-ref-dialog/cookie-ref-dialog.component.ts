import { Component, Inject, OnInit } from '@angular/core';
import { CookieOperation, CookieRef, CookieType } from '../models';
import { Router, ActivatedRoute } from '@angular/router';
import { RPCService } from '../rpc.service';
import { MessageService } from '../message.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ICookie {
  cookieRef: CookieRef
}

@Component({
  selector: 'app-cookie-ref-dialog',
  templateUrl: './cookie-ref-dialog.component.html',
  styleUrls: ['./cookie-ref-dialog.component.css']
})

export class CookieRefDialogComponent {

  cookieRef: CookieRef;
  cookie_type = CookieType;
  cookie_operation = CookieOperation;
  enum_cookie_type_values = [];
  enum_cookie_operation_values = [];

  constructor(private route: ActivatedRoute,
    public rpcService: RPCService,
    private router: Router,
    private msgService: MessageService,
    public dialogRef: MatDialogRef<CookieRefDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICookie) {
    this.cookieRef = data.cookieRef;
    this.enum_cookie_type_values = Object.values(CookieType).filter(f => !isNaN(Number(f)));
    this.enum_cookie_operation_values = Object.values(CookieOperation).filter(f => !isNaN(Number(f)));
  }

  setCookieRef() {
    let self = this;
    this.rpcService.getResponse('update_cookie_ref', function (obj: CookieRef) {
      self.cookieRef = obj;
    }, this.cookieRef.id, this.cookieRef);
    this.dialogRef.close();
  }

}

