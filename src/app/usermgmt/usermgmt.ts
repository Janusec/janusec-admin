import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RPCService } from '../services/rpc.service';
import { AppUser } from '../models/auth';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MessageService } from '../services/message.service';
import { UserDialog } from './user-dialog/user-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-usermgmt',
  imports: [
    MatTableModule,
    MatIcon,
    MatPaginatorModule
  ],
  templateUrl: './usermgmt.html',
  styleUrl: './usermgmt.css'
})
export class Usermgmt {
  dataSource = new MatTableDataSource<AppUser>();
  displayedColumns = ['username', 'is_super_admin', 'is_cert_admin', 'is_app_admin', 'action'];
  keyword: string = '';

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(public rpcService: RPCService,
    public msgService: MessageService,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    if (this.rpcService.authUser$().logged == false) {
      this.router.navigate(['/']);
      return
    }
    if (this.rpcService.authUser$().need_modify_pwd) {
      this.msgService.addWarnMessage('Please modify your password!');
    }
    let self = this;
    this.rpcService.getAppUsers(() => {
      self.dataSource.data = self.rpcService.appUsers$();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  delAppUser(appUser: AppUser) {
    if (!confirm("Are you sure to delete user: " + appUser.username + "?")) return;
    var self = this;
    this.rpcService.getResponse('del_app_user', function () {
      self.rpcService.removeLocalAppUser(appUser.id);
      self.dataSource.data = self.rpcService.appUsers$();
      self.msgService.addWarnMessage(appUser.username + " deleted.");
    }, appUser.id);
  }

  openAppUserDialog(appUser: AppUser | null) {
    this.dialog.open(UserDialog, {
      width: '600px',
      maxWidth: '800px',
      data: { "appUser": appUser ? { ...appUser } : null }
    }).afterClosed().subscribe(() => {
      this.dataSource.data = this.rpcService.appUsers$();
    });
  }

}
