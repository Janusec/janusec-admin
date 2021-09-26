import { Component, OnInit, ViewChild } from '@angular/core';
import { Router }            from '@angular/router';
import { ApplicationService } from '../application.service';
import { AppAdmin } from '../models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-usermgmt',
  templateUrl: './usermgmt.component.html',
  styleUrls: ['./usermgmt.component.css']
})
export class UsermgmtComponent implements OnInit {
  //selectedAdmin: AppAdmin;
  userDataSource: MatTableDataSource<AppAdmin>;
  displayedColumns = ['id', 'username', 'is_super_admin', 'is_cert_admin', 'is_app_admin'];
  userLength: number;
  keyword: string;

  @ViewChild('userPaginator') userPaginator: MatPaginator;

  constructor(public applicationService: ApplicationService,
    private router: Router) { }

  ngOnInit() {
    if (this.applicationService.auth_user.logged==false) {
      this.router.navigate(['/']);
      return
    } 
    if (this.applicationService.auth_user.need_modify_pwd) {
      this.router.navigate(['/appuser/'+this.applicationService.auth_user.user_id]);
    }
    this.applicationService.getAdmins();
    setTimeout(() => 
    {
      this.userDataSource = new MatTableDataSource<AppAdmin>(this.applicationService.admins);
      this.userLength = this.applicationService.admins.length;
    },500); 
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
