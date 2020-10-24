import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Application, Destination, RouteType, GateHealth } from '../models';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-health-check',
  templateUrl: './health-check.component.html',
  styleUrls: ['./health-check.component.css']
})
export class HealthCheckComponent implements OnInit {
  offlineDestinations: Destination[] = [];
  unvisitedDestinations: Destination[] = [];
  selected_app_id: number;
  selected_app: Application;
  gate_health: GateHealth;

  constructor(public applicationService: ApplicationService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.applicationService.auth_user.logged==false) {
        this.router.navigate(['/']);
        return
    }
    
    this.getGatewayHealth();
    this.updateDestinations();
  }

  updateDestinations() {
    this.offlineDestinations = [];
    this.unvisitedDestinations = [];
    let self = this;
    this.applicationService.getResponse('getapps', function(obj: Application[]){      
        self.applicationService.applications = obj;    
        for (let app of self.applicationService.applications) {
            self.applicationService.appmap[app.id]=app.name;
        } 
        var now_ms = (new Date()).getTime();
        for (let app of self.applicationService.applications) {
            for (let dest of app.destinations) {
                if(dest.route_type!=RouteType.Reverse_Proxy) continue;
                if(dest.online==false) {
                    self.offlineDestinations.push(dest);
                } else if ((now_ms - dest.check_time*1000)>86400*1000) {
                    self.unvisitedDestinations.push(dest);
                }
            }
        }
    });

    
  }

  getAppNameByID(app_id:number) {
    return this.applicationService.appmap[app_id];
  }

  health_check_by_app_id() {
    for (let app of this.applicationService.applications) {
        if(app.id==this.selected_app_id) {
            this.selected_app = app;
            return
        }
    }
  }

  getDate(unix: number): string {
    return new Date(unix*1000).toLocaleString('zh-CN', {hour12: false});
  }

  getGatewayHealth() {
    let self = this;
    this.applicationService.getResponse('gate_health', function(obj: GateHealth){
        self.gate_health = obj;
    });
  }

}
