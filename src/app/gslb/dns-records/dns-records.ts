import { Component, Inject, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose, MatDialogActions } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { RRType, DNSRecord, DNSDomain } from '../../models/gslb';
import { RPCService } from '../../services/rpc.service';
import { MessageService } from '../../services/message.service';
import { DNSRecordDialog } from '../dns-record-dialog/dns-record-dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';

export interface IData {
  dnsDomain: DNSDomain
}

@Component({
  selector: 'app-dns-records',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatIcon,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './dns-records.html',
  styleUrl: './dns-records.css'
})
export class DnsRecords {
  dnsDomain: DNSDomain = {
    id: '0',
    name: 'example.com'
  }
  //dnsDomainID: string;
  dnsRecords: DNSRecord[] = [];
  dataSource = new MatTableDataSource<DNSRecord>();
  displayedColumns = ['rrtype', 'name', 'value', 'ttl', 'action'];
  keyword: string = '';

  rrtype = RRType;

  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(
    private route: ActivatedRoute,
    private rpcService: RPCService,
    private messageService: MessageService,
    private http: HttpClient,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: IData) {
    this.dnsDomain = data.dnsDomain;
    this.getDNSRecordsByDomainID(this.dnsDomain.id);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  openDNSRecordDialog(dnsRecord: DNSRecord | null) {
    this.dialog.open(DNSRecordDialog, {
      width: '500px',
      data: { "dnsRecord": dnsRecord ? { ...dnsRecord } : null, "dnsDomain": this.dnsDomain }
    }).afterClosed().subscribe(result => {
      this.getDNSRecordsByDomainID(this.dnsDomain.id);
    });
  }

  getRRTypeName(type: number) {
    return this.rrtype[type];
  }

  deleteDNSRecord(dnsRecord: DNSRecord) {
    if (!confirm("Are you sure to delete dns record: " + dnsRecord.name + "?")) return;
    var self = this;
    this.rpcService.getResponse('del_dns_record', function () {
      self.getDNSRecordsByDomainID(self.dnsDomain.id);
    }, dnsRecord.id);
  }

  getDNSDomainByID(domainID: string) {
    let self = this;
    this.rpcService.getResponse('get_dns_domain', function (obj: DNSDomain) {
      self.dnsDomain = obj;
    }, domainID);
  }

  getDNSRecordsByDomainID(domainID: string) {
    let self = this;
    this.rpcService.getResponse('get_dns_records', function (objs: DNSRecord[]) {
      self.dnsRecords = objs;
      self.dataSource.data = self.dnsRecords;
    }, domainID);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
