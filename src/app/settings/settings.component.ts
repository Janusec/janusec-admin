import { Component, OnInit, ViewChild } from '@angular/core';
import { RPCService } from '../rpc.service';
import { PrimarySetting, WxworkConfig, DingtalkConfig, FeishuConfig, LDAPConfig, CAS2Config, LarkConfig, DiscoveryRule } from '../models';
import { MessageService } from '../message.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings: PrimarySetting;
  readOnlyValue: boolean = true;
  readOnlyButtonText: string = "Edit";
  wxworkConfig: WxworkConfig;
  dingtalkConfig: DingtalkConfig;
  feishuConfig: FeishuConfig;
  larkConfig: LarkConfig;
  ldapConfig: LDAPConfig;
  cas2Config: CAS2Config;


  constructor(private rpcService: RPCService,
    private messageService: MessageService) {
    let self = this;
    this.rpcService.getResponse('get_primary_setting', function (obj: PrimarySetting) {
      self.settings = obj;
      self.loadAuthProvider(self.settings.auth_provider);
    });
  }

  ngOnInit() {

  }

  loadAuthProvider(provide: string) {
    let self = this;
    switch (this.settings.auth_provider) {
      case "wxwork":
        this.rpcService.getResponse('get_wxwork_config', function (obj: WxworkConfig) {
          self.wxworkConfig = obj;
        });
        break;
      case "dingtalk":
        this.rpcService.getResponse('get_dingtalk_config', function (obj: DingtalkConfig) {
          self.dingtalkConfig = obj;
        });
        break;
      case "feishu":
        this.rpcService.getResponse('get_feishu_config', function (obj: FeishuConfig) {
          self.feishuConfig = obj;
        });
        break;
      case "lark":
        this.rpcService.getResponse('get_lark_config', function (obj: LarkConfig) {
          self.larkConfig = obj;
        });
        break;
      case "ldap":
        this.rpcService.getResponse('get_ldap_config', function (obj: LDAPConfig) {
          self.ldapConfig = obj;
        });
        break;
      case "cas2":
        this.rpcService.getResponse('get_cas2_config', function (obj: CAS2Config) {
          self.cas2Config = obj;
        });
        break;
    }
  }

  saveSettings() {
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
      self.messageService.add("Settings saved.");
    }, null, this.settings);
    // update auth_provider
    switch (this.settings.auth_provider) {
      case "wxwork":
        this.rpcService.getResponse('update_wxwork_config', function (obj: WxworkConfig) {
          self.wxworkConfig = obj;
        }, '0', this.wxworkConfig);
        break;
      case "dingtalk":
        this.rpcService.getResponse('update_dingtalk_config', function (obj: DingtalkConfig) {
          self.dingtalkConfig = obj;
        }, '0', this.dingtalkConfig);
        break;
      case "feishu":
        this.rpcService.getResponse('update_feishu_config', function (obj: FeishuConfig) {
          self.feishuConfig = obj;
        }, '0', this.feishuConfig);
        break;
      case "lark":
        this.rpcService.getResponse('update_lark_config', function (obj: LarkConfig) {
          self.larkConfig = obj;
        }, '0', this.larkConfig);
        break;
      case "ldap":
        this.rpcService.getResponse('update_ldap_config', function (obj: LDAPConfig) {
          self.ldapConfig = obj;
        }, '0', this.ldapConfig);
        break;
      case "cas2":
        this.rpcService.getResponse('update_cas2_config', function (obj: CAS2Config) {
          self.cas2Config = obj;
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
      self.messageService.add('Email sent, please check your inbox. If not, check your information under user management.');
    }, '0', this.settings.smtp);
  }



}
