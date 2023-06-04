import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { RRType, DNSDomain } from '../models';
import { RPCService } from '../rpc.service';
import { MessageService } from '../message.service';
import { DnsDomainComponent } from '../dns-domain/dns-domain.component';

@Component({
  selector: 'app-dns-domains',
  templateUrl: './dns-domains.component.html',
  styleUrls: ['./dns-domains.component.css']
})
export class DnsDomainsComponent implements OnInit {

  dnsDomains: DNSDomain[];
  domainsDataSource: MatTableDataSource<DNSDomain>;
  displayedColumns = ['name', 'action'];
  domainLength: number;
  keyword: string;

  rrtype = RRType;

  @ViewChild('domainPaginator') domainPaginator: MatPaginator;
  constructor(
    private rpcService: RPCService,
    private messageService: MessageService,
    private http: HttpClient,
    public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getDNSDomains();
  }


  addDNSDomain() {
    let dnsDomain: DNSDomain = {
      id: '0',
      name: ""
    }
    this.dialog.open(DnsDomainComponent, {
      width: '500px',
      data: { "dnsDomain": dnsDomain }
    }).afterClosed().subscribe(result => {
      this.getDNSDomains();
    });
  }

  editDNSDomain(dnsDomain: DNSDomain) {
    this.dialog.open(DnsDomainComponent, {
      width: '500px',
      data: { "dnsDomain": dnsDomain }
    }).afterClosed().subscribe(result => {
      this.getDNSDomains();
    });
  }

  deleteDNSDomain(dnsDomain: DNSDomain) {
    if (!confirm("Are you sure to delete Domain: " + dnsDomain.name + "?")) return;
    var self = this;
    this.rpcService.getResponse('del_dns_domain', function () {
      self.getDNSDomains();
    }, dnsDomain.id, null);
  }


  getDNSDomains() {
    let self = this;
    this.rpcService.getResponse('get_dns_domains', function (objs: DNSDomain[]) {
      self.dnsDomains = objs;
      self.domainsDataSource = new MatTableDataSource<DNSDomain>(self.dnsDomains);
      self.domainLength = self.dnsDomains.length;
    }, '0', null);
  }

  applyFilter(filterValue: string) {
    this.domainsDataSource.filter = filterValue.trim().toLowerCase();
  }

}
