import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { ApplicationService } from '../application.service';
import { AppAdmin } from '../models';

@Component({
  selector: 'app-usermgmt',
  templateUrl: './usermgmt.component.html',
  styleUrls: ['./usermgmt.component.css']
})
export class UsermgmtComponent implements OnInit {
  selectedAdmin: AppAdmin;
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
  }

  onSelect(admin: AppAdmin): void {
    this.selectedAdmin = admin;
    this.router.navigate(['/appuser/'+this.selectedAdmin.id]);
  }

  addAdmin() {
    this.router.navigate(['/appuser/0']);
  }

}
