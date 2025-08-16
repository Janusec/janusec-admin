import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { RRType, DNSDomain } from '../models/gslb';
import { RPCService } from '../services/rpc.service';
import { MessageService } from '../services/message.service';
import { DNSRecordDialog } from './dns-record-dialog/dns-record-dialog';
import { DNSDomainDialog } from './dns-domain-dialog/dns-domain-dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DnsRecords } from './dns-records/dns-records';

@Component({
  selector: 'app-gslb',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule
  ],
  templateUrl: './gslb.html',
  styleUrl: './gslb.css'
})
export class GSLB {

  dnsDomains: DNSDomain[] = [];
  dataSource = new MatTableDataSource<DNSDomain>();
  displayedColumns = ['name', 'action'];
  keyword: string = '';

  rrtype = RRType;

  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(
    public rpcService: RPCService,
    private msgService: MessageService,
    private http: HttpClient,
    public dialog: MatDialog) {
    this.getDNSDomains();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  openDNSDomainDialog(dnsDomain: DNSDomain | null) {
    this.dialog.open(DNSDomainDialog, {
      width: '500px',
      data: { "dnsDomain": dnsDomain ? { ...dnsDomain } : null }
    }).afterClosed().subscribe(result => {
      this.getDNSDomains();
    });
  }

  deleteDNSDomain(dnsDomain: DNSDomain) {
    if (!confirm("Are you sure to delete Domain: " + dnsDomain.name + "?")) return;
    var self = this;
    this.rpcService.getResponse('del_dns_domain', function () {
      self.getDNSDomains();
    }, dnsDomain.id);
  }

  getDNSDomains() {
    let self = this;
    this.rpcService.getResponse('get_dns_domains', function (objs: DNSDomain[]) {
      self.dnsDomains = objs;
      self.dataSource.data = self.dnsDomains;
    }, '0');
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDNSRecordsDialog(dnsDomain: DNSDomain | null) {
    this.dialog.open(DnsRecords, {
      width: '90%',
      maxWidth: '100%',
      disableClose: true,
      data: { "dnsDomain": dnsDomain ? { ...dnsDomain } : null }
    }).afterClosed().subscribe(result => {
      //this.getDNSDomains();
    });
  }

}
