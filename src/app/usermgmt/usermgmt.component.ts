import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RPCService } from '../rpc.service';
import { AppUser } from '../models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-usermgmt',
  templateUrl: './usermgmt.component.html',
  styleUrls: ['./usermgmt.component.css']
})
export class UsermgmtComponent implements OnInit {
  //selectedAdmin: AppAdmin;
  userDataSource: MatTableDataSource<AppUser>;
  displayedColumns = ['id', 'username', 'is_super_admin', 'is_cert_admin', 'is_app_admin'];
  userLength: number;
  keyword: string;

  @ViewChild('userPaginator') userPaginator: MatPaginator;

  constructor(public rpcService: RPCService,
    private router: Router) { }

  ngOnInit() {
    if (this.rpcService.auth_user.logged == false) {
      this.router.navigate(['/']);
      return
    }
    if (this.rpcService.auth_user.need_modify_pwd) {
      this.router.navigate(['/appuser/' + this.rpcService.auth_user.user_id]);
    }
    this.rpcService.getAppUsers();
    setTimeout(() => {
      this.userDataSource = new MatTableDataSource<AppUser>(this.rpcService.admins);
      this.userLength = this.rpcService.admins.length;
    }, 500);
  }

  /*
  onSelect(admin: AppAdmin): void {
    this.selectedAdmin = admin;
    this.router.navigate(['/appuser/'+this.selectedAdmin.id]);
  }
  */

  addAdmin() {
    this.router.navigate(['/appuser/0']);
  }

  applyFilter(filterValue: string) {
    this.userDataSource.filter = filterValue.trim().toLowerCase();
  }

}
