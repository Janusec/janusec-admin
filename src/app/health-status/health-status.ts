import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Application, Destination, RouteType, VipApp, VipTarget } from '../models/application';
import { GateHealth } from '../models/gateway';
import { RPCService } from '../services/rpc.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-health-status',
  imports: [
    FormsModule,
    MatTabsModule,
    MatListModule,
    MatIcon,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './health-status.html',
  styleUrl: './health-status.css'
})
export class HealthStatus {
  offlineDestinations: Destination[] = [];
  unvisitedDestinations: Destination[] = [];
  offlineVipTargets: VipTarget[] = [];
  unvisitedVipTargets: VipTarget[] = [];
  selectedAppID: string = '0';
  selectedApp: Application | null = null;
  healthStatus: GateHealth | null = null;

  constructor(public rpcService: RPCService,
    public cdr: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit(): void {
    if (this.rpcService.authUser$().logged == false) {
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
    this.rpcService.getApplications(() => {
      for (let app of self.rpcService.applications$()) {
        for (let dest of app.destinations) {
          if (dest.route_type != RouteType.Reverse_Proxy) continue;
          if (dest.online == false) {
            self.offlineDestinations.push(dest);
          } else if ((now_ms - dest.check_time * 1000) > 86400 * 1000) {
            self.unvisitedDestinations.push(dest);
          }
        }
      }
      self.cdr.detectChanges();
    });
    this.rpcService.getVipApps(() => {
      for (let vip_app of self.rpcService.vipApps$()) {
        for (let target of vip_app.targets) {
          if (target.online == false) {
            self.offlineVipTargets.push(target);
          } else if ((now_ms - target.check_time * 1000) > 86400 * 1000) {
            self.unvisitedVipTargets.push(target);
          }
        }
      }
      self.cdr.detectChanges();
    });

  }

  getAppNameByID(app_id: string) {
    return this.rpcService.appMap[app_id];
  }

  getVipAppNameByID(vip_app_id: string) {
    return this.rpcService.vipAppMap[vip_app_id];
  }

  health_check_by_app_id() {
    for (let app of this.rpcService.applications$()) {
      if (app.id == this.selectedAppID) {
        this.selectedApp = app;
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
      self.healthStatus = obj;
      self.cdr.detectChanges();
    });
  }

}
