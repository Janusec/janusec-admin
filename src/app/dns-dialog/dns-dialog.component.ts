import { Component, Inject, OnInit } from '@angular/core';
import { DNSRecord, RRType } from '../models';
import { Router, ActivatedRoute } from '@angular/router';
import { RPCService } from '../rpc.service';
import { MessageService } from '../message.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ICookie {
  dnsRecord: DNSRecord
}

@Component({
  selector: 'app-dns-dialog',
  templateUrl: './dns-dialog.component.html',
  styleUrls: ['./dns-dialog.component.css']
})
export class DnsDialogComponent {

  dnsRecord: DNSRecord;
  rrtype = RRType;
  enum_rrtype_values = [];

  constructor(private route: ActivatedRoute,
    public rpcService: RPCService,
    private router: Router,
    private msgService: MessageService,
    public dialogRef: MatDialogRef<DnsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICookie) {
    this.dnsRecord = data.dnsRecord;
    this.enum_rrtype_values = Object.values(RRType).filter(f => !isNaN(Number(f)));
  }

  setDNSRecord() {
    let self = this;
    this.rpcService.getResponse('update_dns_record', function (obj: DNSRecord) {
      self.dnsRecord = obj;
    }, this.dnsRecord.id, this.dnsRecord);
    this.dialogRef.close();
  }

}

