import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Application, Destination, RouteType, GateHealth, VipTarget, VipApp } from '../models';
import { RPCService } from '../rpc.service';

@Component({
  selector: 'app-health-check',
  templateUrl: './health-check.component.html',
  styleUrls: ['./health-check.component.css']
})
export class HealthCheckComponent implements OnInit {
  offlineDestinations: Destination[] = [];
  unvisitedDestinations: Destination[] = [];
  offlineVipTargets: VipTarget[] = [];
  unvisitedVipTargets: VipTarget[] = [];
  selected_app_id: string;
  selected_app: Application;
  gate_health: GateHealth;

  constructor(public rpcService: RPCService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.rpcService.auth_user.logged == false) {
      this.router.navigate(['/']);
      return
    }

    this.getGatewayHealth();
    this.updateDestinations();
  }

  updateDestinations() {
    this.offlineDestinations = [];
    this.unvisitedDestinations = [];
    this.offlineVipTargets = [];
    this.unvisitedVipTargets = [];
    let self = this;
    var now_ms = (new Date()).getTime();
    this.rpcService.getResponse('get_apps', function (obj: Application[]) {
      self.rpcService.applications = obj;
      for (let app of self.rpcService.applications) {
        self.rpcService.appmap[app.id] = app.name;
      }
      for (let app of self.rpcService.applications) {
        for (let dest of app.destinations) {
          if (dest.route_type != RouteType.Reverse_Proxy) continue;
          if (dest.online == false) {
            self.offlineDestinations.push(dest);
          } else if ((now_ms - dest.check_time * 1000) > 86400 * 1000) {
            self.unvisitedDestinations.push(dest);
          }
        }
      }
    });
    this.rpcService.getResponse('get_vip_apps', function (obj: VipApp[]) {
      self.rpcService.vip_apps = obj;
      for (let vip_app of self.rpcService.vip_apps) {
        self.rpcService.vip_app_map[vip_app.id] = vip_app.name;
        for (let target of vip_app.targets) {
          if (target.online == false) {
            self.offlineVipTargets.push(target);
          } else if ((now_ms - target.check_time * 1000) > 86400 * 1000) {
            self.unvisitedVipTargets.push(target);
          }
        }
      }
    });

  }

  getAppNameByID(app_id: string) {
    return this.rpcService.appmap[app_id];
  }

  getVipAppNameByID(vip_app_id: string) {
    return this.rpcService.vip_app_map[vip_app_id];
  }

  health_check_by_app_id() {
    for (let app of this.rpcService.applications) {
      if (app.id == this.selected_app_id) {
        this.selected_app = app;
        return
      }
    }
  }

  getDate(unix: number): string {
    return this.rpcService.getDateString(unix);
  }

  getGatewayHealth() {
    let self = this;
    this.rpcService.getResponse('get_gateway_health', function (obj: GateHealth) {
      self.gate_health = obj;
    });
  }

}
