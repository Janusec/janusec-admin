import { Component, Inject, OnInit } from '@angular/core';
import { DNSDomain } from '../models';
import { Router, ActivatedRoute } from '@angular/router';
import { RPCService } from '../rpc.service';
import { MessageService } from '../message.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface IDnsDomain {
  dnsDomain: DNSDomain
}

@Component({
  selector: 'app-dns-domain',
  templateUrl: './dns-domain.component.html',
  styleUrls: ['./dns-domain.component.css']
})
export class DnsDomainComponent {

  dnsDomain: DNSDomain;

  constructor(private route: ActivatedRoute,
    public rpcService: RPCService,
    private router: Router,
    private msgService: MessageService,
    public dialogRef: MatDialogRef<DnsDomainComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDnsDomain) {
    this.dnsDomain = data.dnsDomain;
  }

  setDNSDomain() {
    let self = this;
    this.rpcService.getResponse('update_dns_domain', function (obj: DNSDomain) {
      self.dnsDomain = obj;
    }, this.dnsDomain.id, this.dnsDomain);
    this.dialogRef.close();
  }

}

