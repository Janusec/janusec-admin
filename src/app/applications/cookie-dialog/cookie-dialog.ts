import { Component, Inject, OnInit } from '@angular/core';
import { Cookie, CookieType } from '../../models/cookie';
import { Router, ActivatedRoute } from '@angular/router';
import { RPCService } from '../../services/rpc.service';
import { MessageService } from '../../services/message.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

export interface ICookie {
  cookie: Cookie
}

@Component({
  selector: 'app-cookie-dialog',
  imports: [
    FormsModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './cookie-dialog.html',
  styleUrl: './cookie-dialog.css'
})
export class CookieDialog {
  cookie: Cookie;
  cookie_type = CookieType;
  //enum_cookie_type_values = [];
  cookieTypeEntries: [string, string | CookieType][] = [];

  constructor(private route: ActivatedRoute,
    public rpcService: RPCService,
    private router: Router,
    private msgService: MessageService,
    public dialogRef: MatDialogRef<CookieDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ICookie) {
    this.cookie = data.cookie;
    //this.enum_cookie_type_values = Object.values(CookieType).filter(f => !isNaN(Number(f)));
    this.cookieTypeEntries = Object.entries(CookieType).filter(
      ([key, value]) => typeof value === 'number'
    );
    console.log(this.cookieTypeEntries);
  }

  setCookie() {
    let self = this;
    this.rpcService.getResponse('update_cookie', function (obj: Cookie) {
      self.cookie = obj;
    }, this.cookie.id, this.cookie);
    this.dialogRef.close();
  }
}
