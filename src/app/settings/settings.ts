import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RPCService } from '../services/rpc.service';
import { PrimarySetting, DiscoveryRule } from '../models/gateway';
import { WxworkConfig, DingtalkConfig, FeishuConfig, LDAPConfig, CAS2Config, LarkConfig } from '../models/auth'
import { MessageService } from '../services/message.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-settings',
  imports: [
    FormsModule,
    MatTabsModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  settings: PrimarySetting | null = null;
  readOnlyValue: boolean = true;
  readOnlyButtonText: string = "Edit";
  wxworkConfig: WxworkConfig | undefined = undefined;
  dingtalkConfig: DingtalkConfig | undefined = undefined;
  feishuConfig: FeishuConfig | undefined = undefined;
  larkConfig: LarkConfig | undefined = undefined;
  ldapConfig: LDAPConfig | undefined = undefined;
  cas2Config: CAS2Config | undefined = undefined;


  constructor(private rpcService: RPCService,
    private router: Router,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService) {
    let self = this;
    this.rpcService.getResponse('get_primary_setting', function (obj: PrimarySetting) {
      self.settings = obj;
      if (self.settings.auth_provider === '') {
        self.cdr.detectChanges();
      } else {
        self.loadAuthProvider(self.settings.auth_provider);
      }
    });
  }

  ngOnInit() {
    if (this.rpcService.authUser$().logged == false) {
      this.router.navigate(['/']);
      return
    }
  }

  loadAuthProvider(provide: string) {
    if (this.settings === null) return;
    let self = this;
    switch (this.settings.auth_provider) {
      case "wxwork":
        this.rpcService.getResponse('get_wxwork_config', function (obj: WxworkConfig) {
          self.wxworkConfig = obj;
          self.cdr.detectChanges();
        });
        break;
      case "dingtalk":
        this.rpcService.getResponse('get_dingtalk_config', function (obj: DingtalkConfig) {
          self.dingtalkConfig = obj;
          self.cdr.detectChanges();
        });
        break;
      case "feishu":
        this.rpcService.getResponse('get_feishu_config', function (obj: FeishuConfig) {
          self.feishuConfig = obj;
          self.cdr.detectChanges();
        });
        break;
      case "lark":
        this.rpcService.getResponse('get_lark_config', function (obj: LarkConfig) {
          self.larkConfig = obj;
          self.cdr.detectChanges();
        });
        break;
      case "ldap":
        this.rpcService.getResponse('get_ldap_config', function (obj: LDAPConfig) {
          self.ldapConfig = obj;
          self.cdr.detectChanges();
        });
        break;
      case "cas2":
        this.rpcService.getResponse('get_cas2_config', function (obj: CAS2Config) {
          self.cas2Config = obj;
          self.cdr.detectChanges();
        });
        break;
    }
  }

  saveSettings() {
    if (this.settings === null) return;
    // check length of custom shield and waf template
    if (this.settings.shield_html.length > 16384) {
      alert("The length of the 5-second shield HTML template is too long, please cut it to below 16K !");
      return;
    }
    if (this.settings.block_html.length > 16384) {
      alert("The length of the WAF HTML template is too long, please cut it to below 16K !");
      return;
    }
    let self = this;
    this.rpcService.getResponse('update_primary_setting', function (obj: PrimarySetting) {
      self.settings = obj;
      self.readOnlyValue = true;
      self.readOnlyButtonText = "Edit";
      self.messageService.addSuccessMessage("Settings saved.");
      self.cdr.detectChanges();
    }, null, this.settings);
    // update auth_provider
    switch (this.settings.auth_provider) {
      case "wxwork":
        this.rpcService.getResponse('update_wxwork_config', function (obj: WxworkConfig) {
          self.wxworkConfig = obj;
          self.cdr.detectChanges();
        }, '0', this.wxworkConfig);
        break;
      case "dingtalk":
        this.rpcService.getResponse('update_dingtalk_config', function (obj: DingtalkConfig) {
          self.dingtalkConfig = obj;
          self.cdr.detectChanges();
        }, '0', this.dingtalkConfig);
        break;
      case "feishu":
        this.rpcService.getResponse('update_feishu_config', function (obj: FeishuConfig) {
          self.feishuConfig = obj;
          self.cdr.detectChanges();
        }, '0', this.feishuConfig);
        break;
      case "lark":
        this.rpcService.getResponse('update_lark_config', function (obj: LarkConfig) {
          self.larkConfig = obj;
          self.cdr.detectChanges();
        }, '0', this.larkConfig);
        break;
      case "ldap":
        this.rpcService.getResponse('update_ldap_config', function (obj: LDAPConfig) {
          self.ldapConfig = obj;
          self.cdr.detectChanges();
        }, '0', this.ldapConfig);
        break;
      case "cas2":
        this.rpcService.getResponse('update_cas2_config', function (obj: CAS2Config) {
          self.cas2Config = obj;
          self.cdr.detectChanges();
        }, '0', this.cas2Config);
        break;
    }
  }

  changeEditable() {
    this.readOnlyValue = !this.readOnlyValue;
    if (this.readOnlyValue) {
      this.readOnlyButtonText = "Edit";
    } else {
      this.readOnlyButtonText = "Cancel";
    }
  }

  testSMTP() {
    let self = this;
    this.rpcService.getResponse('test_smtp', function () {
      self.messageService.addSuccessMessage('Email sent, please check your inbox. If not, check your information under user management.');
    }, '0', this.settings?.smtp);
  }



}
