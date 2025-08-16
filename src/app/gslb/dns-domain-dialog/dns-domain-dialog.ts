import { Component, Inject, OnInit } from '@angular/core';
import { DNSDomain } from '../../models/gslb';
import { Router, ActivatedRoute } from '@angular/router';
import { RPCService } from '../../services/rpc.service';
import { MessageService } from '../../services/message.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose, MatDialogActions } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


export interface IData {
  dnsDomain: DNSDomain
}

@Component({
  selector: 'app-dns-domain-dialog',
  imports: [
    FormsModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './dns-domain-dialog.html',
  styleUrl: './dns-domain-dialog.css'
})
export class DNSDomainDialog {

  dnsDomain: DNSDomain = {
    id: '0',
    name: 'example.com'
  }

  constructor(private route: ActivatedRoute,
    public rpcService: RPCService,
    private router: Router,
    private msgService: MessageService,
    public dialogRef: MatDialogRef<DNSDomainDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IData) {
    if (data.dnsDomain !== null) {
      this.dnsDomain = data.dnsDomain;
    }
  }

  setDNSDomain() {
    let self = this;
    this.rpcService.getResponse('update_dns_domain', function (obj: DNSDomain) {
      self.dnsDomain = obj;
    }, this.dnsDomain.id, this.dnsDomain);
    this.dialogRef.close();
  }
}
