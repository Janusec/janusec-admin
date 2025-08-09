import { Component, Inject, OnInit } from '@angular/core';
import { CookieType, CookieOperation, CookieRef } from '../../models/cookie';
import { Router, ActivatedRoute } from '@angular/router';
import { RPCService } from '../../services/rpc.service';
import { MessageService } from '../../services/message.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

export interface ICookieRef {
  cookieRef: CookieRef
}

@Component({
  selector: 'app-cookie-ref-dialog',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './cookie-ref-dialog.html',
  styleUrl: './cookie-ref-dialog.css'
})
export class CookieRefDialog {

  cookieRef: CookieRef = {
    id: '0',
    name: "",
    vendor: "",
    type: CookieType.Unclassified,
    description: "",
    operation: CookieOperation.EqualsString
  }
  cookieTypeEntries: [string, string | CookieType][] = [];
  cookieOperationEntries: [string, string | CookieOperation][] = [];

  constructor(private route: ActivatedRoute,
    public rpcService: RPCService,
    //private router: Router,
    //private msgService: MessageService,
    public dialogRef: MatDialogRef<CookieRefDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ICookieRef) {
    if (data.cookieRef) {
      this.cookieRef = data.cookieRef;
    }
    this.cookieTypeEntries = Object.entries(CookieType).filter(
      ([key, value]) => typeof value === 'number'
    );
    this.cookieOperationEntries = Object.entries(CookieOperation).filter(
      ([key, value]) => typeof value === 'number'
    );
  }

  setCookieRef() {
    let self = this;
    this.rpcService.getResponse('update_cookie_ref', function (obj: CookieRef) {
      self.cookieRef = obj;
    }, this.cookieRef.id, this.cookieRef);
    this.dialogRef.close();
  }
}
