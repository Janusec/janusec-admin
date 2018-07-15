import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Application } from '../models';
import { ApplicationService } from '../application.service';
//import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  
  selectedApplication: Application;

  constructor(
    public applicationService: ApplicationService,
    private router: Router) { }
/*
  getApplications(): void {
    this.applicationService
        .getApplications()
        .subscribe((applications) => {
          if (applications==null) {
            this.router.navigate(['/login']);
          } else {
            this.applicationService.applications = applications;
          }          
        });
  }
*/
  ngOnInit(): void {
    if (this.applicationService.auth_user.logged==false) {
      this.router.navigate(['/']);
      return
    } 
    if (this.applicationService.auth_user.need_modify_pwd) {
      this.router.navigate(['/appuser/'+this.applicationService.auth_user.user_id]);
    }
    this.applicationService.getApplications();
    setTimeout(() => 
    {
      if (this.applicationService.auth_user.logged==false) {
        this.router.navigate(['/login']);
      } 
    },500); 
  }

  onSelect(application: Application): void {
    this.selectedApplication = application;
    this.router.navigate(['/application/'+this.selectedApplication.id]);
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedApplication.id]);
  }

  addApplication():void {
    this.router.navigate(['/application/0']);
  }

}
