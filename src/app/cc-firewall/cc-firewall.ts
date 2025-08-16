import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Application } from '../models/application';
import { CCPolicy } from '../models/security';
import { MessageService } from '../services/message.service';
import { PolicyAction } from '../models/security';
import { RPCService } from '../services/rpc.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-cc-firewall',
  imports: [
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './cc-firewall.html',
  styleUrl: './cc-firewall.css'
})
export class CCFirewall {

  global_cc_policy: CCPolicy | undefined = undefined;
  app_cc_policy: CCPolicy = {
    app_id: '0', // need to be changed
    interval_milliseconds: 100,
    max_count: 20,
    block_seconds: 900,
    stat_by_url: true,
    stat_by_ua: true,
    stat_by_cookie: false,
    action: PolicyAction.BLOCK,
    is_enabled: true
  };
  selected_app_id: string = '0';
  application: Application | null = null;
  has_custom_cc_policy: boolean = false;
  is_new_policy: boolean = false;
  //enum_action_values: { value: number; name: string }[] = [];//number[]=[];
  policyActionEntries: [string, string | PolicyAction][] = [];

  constructor(public msgService: MessageService,
    public rpcService: RPCService,
    public cdr: ChangeDetectorRef,
    private router: Router) {

    this.policyActionEntries = Object.entries(PolicyAction).filter(
      ([key, value]) => typeof value === 'number'
    );

    if (this.rpcService.authUser$().logged) {
      if (this.rpcService.applications$().length == 0) {
        this.rpcService.getApplications(() => { });
      }
      if (this.rpcService.vulnTypes$().length == 0) {
        this.rpcService.getVulnTypes(function () { });
      }
      this.getCCPolicy('0');
    }
  }

  ngOnInit() {
    if (this.rpcService.authUser$().logged == false) {
      this.router.navigate(['/']);
      return
    }
    if (this.rpcService.authUser$().need_modify_pwd) {
      this.msgService.addWarnMessage('Please modify your password!');
    }
  }

  getCCPolicy(id: string) {
    var self = this;
    this.rpcService.getResponse('get_cc_policy', function (obj: CCPolicy) {
      if (obj == null) return;
      if (id == '0') {
        self.global_cc_policy = obj;
      } else {
        self.app_cc_policy = obj;
        if (self.app_cc_policy.app_id != '0') {
          self.has_custom_cc_policy = true;
        } else {
          if (self.is_new_policy) self.has_custom_cc_policy = true;
          else self.has_custom_cc_policy = false;
        }
      }
      self.is_new_policy = false;
      self.cdr.detectChanges();
    }, id);
  }

  newCCPolicy(app_id: string) {
    this.is_new_policy = true;
    this.has_custom_cc_policy = true;
    this.app_cc_policy.app_id = app_id;
  }

  updateCCPolicy(app_id: string) {
    var cc_policy: CCPolicy | undefined = undefined;
    if (app_id == '0') {
      cc_policy = this.global_cc_policy;
    } else {
      cc_policy = this.app_cc_policy;
      if (cc_policy.app_id != app_id) {
        cc_policy.app_id = app_id;
      }
    }
    let self = this;
    this.rpcService.getResponse('update_cc_policy', function () {
      self.msgService.addSuccessMessage("CC policy updated!");
    }, app_id, cc_policy);
  }

  deleteCCPolicy(app_id: string) {
    if (app_id == '0') return;
    this.has_custom_cc_policy = false;
    let self = this;
    this.rpcService.getResponse('del_cc_policy', function () {
      self.msgService.addWarnMessage("CC policy deleted!");
    }, app_id);
  }

  onSelectApp() {
    var self = this;
    this.rpcService.getResponse('get_app', function (obj: Application) {
      if (obj != null) self.application = obj;
    }, this.selected_app_id);
    this.getCCPolicy(this.selected_app_id);
    this.is_new_policy = false;
  }

}
