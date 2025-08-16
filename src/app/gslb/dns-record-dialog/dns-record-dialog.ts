import { Component, Inject, OnInit } from '@angular/core';
import { DNSDomain, DNSRecord, RRType } from '../../models/gslb';
import { Router, ActivatedRoute } from '@angular/router';
import { RPCService } from '../../services/rpc.service';
import { MessageService } from '../../services/message.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose, MatDialogActions } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

export interface IData {
  dnsRecord: DNSRecord;
  dnsDomain: DNSDomain;
}

@Component({
  selector: 'app-dns-record-dialog',
  imports: [
    FormsModule,
    MatIcon,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './dns-record-dialog.html',
  styleUrl: './dns-record-dialog.css'
})
export class DNSRecordDialog {

  dnsRecord: DNSRecord;
  dnsDomain: DNSDomain;
  rrtype = RRType;
  rrTypeEntries: [string, string | RRType][] = [];

  rrTypeA = RRType.A;
  rrTypeAAAA = RRType.AAAA;

  constructor(private route: ActivatedRoute,
    public rpcService: RPCService,
    private router: Router,
    private msgService: MessageService,
    public dialogRef: MatDialogRef<DNSRecordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IData) {
    this.dnsDomain = data.dnsDomain;
    if (data.dnsRecord) {
      this.dnsRecord = data.dnsRecord;
    } else {
      // new
      this.dnsRecord = {
        id: '0',
        dns_domain_id: this.dnsDomain.id,
        rrtype: RRType.A,
        name: "",
        value: "",
        ttl: 3600,
        auto: false,
        internal: false
      }
    }
    this.rrTypeEntries = Object.entries(RRType).filter(
      ([key, value]) => typeof value === 'number'
    );
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
