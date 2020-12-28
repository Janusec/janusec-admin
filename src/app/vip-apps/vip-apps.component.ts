import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { ApplicationService } from '../application.service';
import { VipApp } from '../models';

@Component({
  selector: 'app-vip-apps',
  templateUrl: './vip-apps.component.html',
  styleUrls: ['./vip-apps.component.css']
})
export class VipAppsComponent implements OnInit {
  selectedVipApp: VipApp;

  constructor(public applicationService: ApplicationService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.applicationService.auth_user.logged==false) {
        this.router.navigate(['/']);
        return
    } 
    this.applicationService.getVipApps();
  }

  addVipApp() {
    this.router.navigate(['/vip/0']);
  }
  
  onSelect(vip_app: VipApp):void {
    this.selectedVipApp = vip_app;
    this.router.navigate(['/vip/'+ this.selectedVipApp.id]);
  }

}
