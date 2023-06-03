import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { CookieType, CookieRef, CookieOperation } from '../models';
import { RPCService } from '../rpc.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '../message.service';
import { OAuthInfo } from '../models';
import { CookieRefDialogComponent } from '../cookie-ref-dialog/cookie-ref-dialog.component';

@Component({
  selector: 'app-cookie-refs',
  templateUrl: './cookie-refs.component.html',
  styleUrls: ['./cookie-refs.component.css']
})
export class CookieRefsComponent implements OnInit {

  cookieRefs: CookieRef[];
  cookieRefsDataSource: MatTableDataSource<CookieRef>;
  displayedColumns = ['name', 'operation', 'type', 'vendor', 'description', 'action'];
  cookieLength: number;
  keyword: string;

  cookie_operation = CookieOperation;
  cookie_type = CookieType;

  @ViewChild('cookiePaginator') cookiePaginator: MatPaginator;
  constructor(
    private rpcService: RPCService,
    private messageService: MessageService,
    private http: HttpClient,
    public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getCookieRefs();
  }


  addCookieRef() {
    let cookieRef: CookieRef = {
      id: '0',
      name: "",
      vendor: "",
      type: CookieType.Unclassified,
      description: "",
      operation: CookieOperation.EqualsString
    }
    this.dialog.open(CookieRefDialogComponent, {
      width: '500px',
      data: { "cookieRef": cookieRef }
    }).afterClosed().subscribe(result => {
      this.getCookieRefs();
    });
  }

  editCookieRef(cookieRef: CookieRef) {
    this.dialog.open(CookieRefDialogComponent, {
      width: '500px',
      data: { "cookieRef": cookieRef }
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
    }, cookieRef.id, null);
  }


  getCookieRefs() {
    let self = this;
    this.rpcService.getResponse('get_cookie_refs', function (objs: CookieRef[]) {
      self.cookieRefs = objs;
      self.cookieRefsDataSource = new MatTableDataSource<CookieRef>(self.cookieRefs);
      self.cookieLength = self.cookieRefs.length;
    }, '0', null);
  }

  applyFilter(filterValue: string) {
    this.cookieRefsDataSource.filter = filterValue.trim().toLowerCase();
  }

}
