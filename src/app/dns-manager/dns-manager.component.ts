import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { RRType, DNSRecord, DNSDomain } from '../models';
import { RPCService } from '../rpc.service';
import { MessageService } from '../message.service';
import { DnsDialogComponent } from '../dns-dialog/dns-dialog.component';

@Component({
  selector: 'app-dns-manager',
  templateUrl: './dns-manager.component.html',
  styleUrls: ['./dns-manager.component.css']
})
export class DnsManagerComponent implements OnInit {
  dnsDomain: DNSDomain;
  dnsDomainID: string;
  dnsRecords: DNSRecord[];
  dnsRecordsDataSource: MatTableDataSource<DNSRecord>;
  displayedColumns = ['rrtype', 'name', 'value', 'ttl', 'action'];
  dnsLength: number;
  keyword: string;

  rrtype = RRType;

  @ViewChild('dnsPaginator') dnsPaginator: MatPaginator;
  constructor(
    private route: ActivatedRoute,
    private rpcService: RPCService,
    private messageService: MessageService,
    private http: HttpClient,
    public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.dnsDomainID = this.route.snapshot.paramMap.get('id');
    this.getDNSDomainByID(this.dnsDomainID);
    this.getDNSRecordsByDomainID(this.dnsDomainID);
  }

  addDNSRecord() {
    let dnsRecord: DNSRecord = {
      id: '0',
      dns_domain_id: this.dnsDomain.id,
      rrtype: RRType.A,
      name: "",
      value: "",
      ttl: 3600,
      auto: false,
      internal: false
    }
    this.dialog.open(DnsDialogComponent, {
      width: '500px',
      data: { "dnsRecord": dnsRecord }
    }).afterClosed().subscribe(result => {
      this.getDNSRecordsByDomainID(this.dnsDomainID);
    });
  }

  editDNSRecord(dnsRecord: DNSRecord) {
    this.dialog.open(DnsDialogComponent, {
      width: '500px',
      data: { "dnsRecord": dnsRecord }
    }).afterClosed().subscribe(result => {
      this.getDNSRecordsByDomainID(this.dnsDomainID);
    });
  }

  getRRTypeName(type: number) {
    return this.rrtype[type];
  }

  deleteDNSRecord(dnsRecord: DNSRecord) {
    if (!confirm("Are you sure to delete dns record: " + dnsRecord.name + "?")) return;
    var self = this;
    this.rpcService.getResponse('del_dns_record', function () {
      self.getDNSRecordsByDomainID(this.dnsDomainID);
    }, dnsRecord.id, null);
  }

  getDNSDomainByID(domainID: string) {
    let self = this;
    this.rpcService.getResponse('get_dns_domain', function (obj: DNSDomain) {
      self.dnsDomain = obj;
    }, this.dnsDomainID, null);
  }

  getDNSRecordsByDomainID(domainID: string) {
    let self = this;
    this.rpcService.getResponse('get_dns_records', function (objs: DNSRecord[]) {
      self.dnsRecords = objs;
      self.dnsRecordsDataSource = new MatTableDataSource<DNSRecord>(self.dnsRecords);
      self.dnsLength = self.dnsRecords.length;
    }, this.dnsDomainID, null);
  }

  applyFilter(filterValue: string) {
    this.dnsRecordsDataSource.filter = filterValue.trim().toLowerCase();
  }

}
