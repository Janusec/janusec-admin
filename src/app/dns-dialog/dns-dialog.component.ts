import { Component, Inject, OnInit } from '@angular/core';
import { DNSDomain, DNSRecord, RRType } from '../models';
import { Router, ActivatedRoute } from '@angular/router';
import { RPCService } from '../rpc.service';
import { MessageService } from '../message.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface IDnsRecord {
  dnsRecord: DNSRecord;
  dnsDomain: DNSDomain;
}

@Component({
  selector: 'app-dns-dialog',
  templateUrl: './dns-dialog.component.html',
  styleUrls: ['./dns-dialog.component.css']
})

export class DnsDialogComponent {

  dnsRecord: DNSRecord;
  dnsDomain: DNSDomain;
  rrtype = RRType;
  enum_rrtype_values = [];

  constructor(private route: ActivatedRoute,
    public rpcService: RPCService,
    private router: Router,
    private msgService: MessageService,
    public dialogRef: MatDialogRef<DnsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDnsRecord) {
    this.dnsRecord = data.dnsRecord;
    this.dnsDomain = data.dnsDomain;
    this.enum_rrtype_values = Object.values(RRType).filter(f => !isNaN(Number(f)));
  }

  setDNSRecord() {
    let self = this;
    this.rpcService.getResponse('update_dns_record', function (obj: DNSRecord) {
      self.dnsRecord = obj;
    }, this.dnsRecord.id, this.dnsRecord);
    this.dialogRef.close();
  }

  onAutoChange() {
    if (this.dnsRecord.auto && this.dnsRecord.ttl > 1000) {
      this.dnsRecord.ttl = 30;
    }
    if (!this.dnsRecord.auto && this.dnsRecord.ttl <= 30) {
      this.dnsRecord.ttl = 3600;
    }
  }

}

