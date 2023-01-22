import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../application.service';
import { MessageService } from '../message.service';
import { RouteType, VipApp, VipTarget } from '../models';
import { Target } from '@angular/compiler';

@Component({
  selector: 'app-vip-app',
  templateUrl: './vip-app.component.html',
  styleUrls: ['./vip-app.component.css']
})
export class VipAppComponent implements OnInit {

  vip_app: VipApp;
  reverseProxyMode = RouteType.Reverse_Proxy;
  k8sMode = RouteType.K8S_Ingress;

  readOnlyValue: boolean = true;
  readOnlyButtonText: string = "Edit"

  constructor(private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private router: Router,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.getVipApp();
  }

  getVipApp(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    if (id > 0) {
      var self = this;
      this.applicationService.getResponse('get_vip_app', function (obj: VipApp) {
        if (obj != null) self.vip_app = obj;
      }, id);
    } else {
      this.readOnlyValue = false;
      this.vip_app = new VipApp();
      this.vip_app.id = 0;
      this.vip_app.name = 'XXX',
        this.vip_app.listen_port = 8001,
        this.vip_app.is_tcp = true;
      this.vip_app.targets = [];
      this.vip_app.owner = this.applicationService.auth_user.username;
      this.vip_app.description = 'Used for YYY';
      this.addTarget();
    }
  }

  addTarget() {
    if (this.readOnlyValue) return;
    var new_target: VipTarget = new VipTarget();
    new_target.id = 0;
    new_target.vip_app_id = 0;
    new_target.route_type = RouteType.Reverse_Proxy;
    new_target.destination = "127.0.0.1:4001";
    new_target.pods_api = 'http://127.0.0.1:8080/api/v1/namespaces/default/pods';
    new_target.pod_port = '80';
    this.vip_app.targets.push(new_target);
  }

  delTarget(i: number) {
    if (this.readOnlyValue) return;
    if (this.vip_app.targets.length == 1) {
      alert("At least one item is required!");
      return;
    }
    this.vip_app.targets.splice(i, 1);
  }

  updateVipApp() {
    var self = this;
    this.applicationService.getResponse('update_vip_app', function (obj: VipApp) {
      if (obj == null) {
        self.messageService.add("Update failed.");
        return;
      }
      let new_id = obj.id;
      if (self.vip_app.id == new_id) {
        self.vip_app = obj;
      }
      else {
        self.vip_app.id = new_id;
        self.router.navigate(['/vip/' + new_id]);
      }
      self.readOnlyValue = true;
      self.readOnlyButtonText = "Edit";
      self.messageService.add("Port forwarding " + obj.name + " Saved.");
    }, null, self.vip_app);
  }

  deleteVipApp() {
    if (!confirm("Are you sure to delete application: " + this.vip_app.name + "?")) return;
    var self = this;
    this.applicationService.getResponse('del_vip_app', function () {
      self.messageService.add(self.vip_app.name + " deleted.");
      self.router.navigate(['/forwarding']);
    }, this.vip_app.id, null);
  }

  changeEditable() {
    this.readOnlyValue = !this.readOnlyValue;
    if (this.readOnlyValue) {
      this.readOnlyButtonText = "Edit";
    } else {
      this.readOnlyButtonText = "Cancel";
    }
  }

}
