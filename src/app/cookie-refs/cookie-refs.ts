import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { CookieType, CookieRef, CookieOperation } from '../models/cookie';
import { RPCService } from '../services/rpc.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '../services/message.service';
import { OAuthInfo } from '../models/auth';
import { CookieRefDialog } from './cookie-ref-dialog/cookie-ref-dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cookie-refs',
  imports: [
    MatTableModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './cookie-refs.html',
  styleUrl: './cookie-refs.css'
})
export class CookieRefs {

  cookieRefs: CookieRef[] = [];
  dataSource = new MatTableDataSource<CookieRef>();
  displayedColumns = ['name', 'operation', 'type', 'vendor', 'description', 'action'];
  keyword: string = '';

  cookie_operation = CookieOperation;
  cookie_type = CookieType;

  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(
    private rpcService: RPCService,
    private msgService: MessageService,
    private http: HttpClient,
    public dialog: MatDialog) {
    this.getCookieRefs();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  openCookieRef(cookieRef: CookieRef | null) {
    this.dialog.open(CookieRefDialog, {
      width: '500px',
      data: { "cookieRef": cookieRef ? { ...cookieRef } : null }
    }).afterClosed().subscribe(result => {
      this.getCookieRefs();
    });
  }


  getCookieOperationName(operation: number) {
    return this.cookie_operation[operation];
  }

  getCookieTypeName(type: number) {
    return this.cookie_type[type];
  }

  deleteCookieRef(cookieRef: CookieRef) {
    if (!confirm("Are you sure to delete cookieRef: " + cookieRef.name + "?")) return;
    var self = this;
    this.rpcService.getResponse('del_cookie_ref', function () {
      self.getCookieRefs();
    }, cookieRef.id);
  }


  getCookieRefs() {
    let self = this;
    this.rpcService.getResponse('get_cookie_refs', function (objs: CookieRef[]) {
      self.cookieRefs = objs;
      self.dataSource.data = self.cookieRefs;
    }, '0');
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
