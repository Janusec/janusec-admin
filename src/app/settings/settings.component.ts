import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../application.service'; 
import { Settings, WxworkConfig, DingtalkConfig, FeishuConfig, LDAPConfig, CAS2Config } from '../models';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings : Settings;
  readOnlyValue: boolean = true;
  readOnlyButtonText: string = "Edit";
  wxworkConfig: WxworkConfig;
  dingtalkConfig: DingtalkConfig;
  feishuConfig: FeishuConfig;
  ldapConfig: LDAPConfig;
  cas2Config: CAS2Config;

  constructor(private applicationService: ApplicationService,
    private messageService: MessageService) { }

  ngOnInit() {
      let self = this;
      this.applicationService.getResponse('get_global_settings', function(obj: Settings){
          self.settings = obj;    
          self.loadAuthProvider(self.settings.auth_provider);         
      });
  }

  loadAuthProvider(provide:string) {
      let self =this;
      switch(this.settings.auth_provider) {
        case "wxwork":                  
            this.applicationService.getResponse('get_wxwork_config', function(obj: WxworkConfig){
              self.wxworkConfig = obj;
            });
            break;
        case "dingtalk":
            this.applicationService.getResponse('get_dingtalk_config', function(obj: DingtalkConfig){
                self.dingtalkConfig = obj;
              });
            break;
        case "feishu":
            this.applicationService.getResponse('get_feishu_config', function(obj: FeishuConfig){
                self.feishuConfig = obj;
              });
            break;
        case "ldap":
            this.applicationService.getResponse('get_ldap_config', function(obj: LDAPConfig){
                self.ldapConfig = obj;
              });
            break;
        case "cas2":
            this.applicationService.getResponse('get_cas2_config', function(obj: CAS2Config){
                self.cas2Config = obj;
              });
            break;
    }
  }

  saveSettings() {
    let self = this;
    this.applicationService.getResponse('update_global_settings', function(obj: Settings){
        self.settings = obj;
        self.readOnlyValue = true;
        self.readOnlyButtonText="Edit";
        self.messageService.add("Settings Saved.");
    }, null, this.settings);
    // update auth_provider
    switch(this.settings.auth_provider) {
        case "wxwork":                  
        this.applicationService.getResponse('update_wxwork_config', function(obj: WxworkConfig){
          self.wxworkConfig = obj;
        }, 0, this.wxworkConfig);
        break;
    case "dingtalk":
        this.applicationService.getResponse('update_dingtalk_config', function(obj: DingtalkConfig){
            self.dingtalkConfig = obj;
          }, 0, this.dingtalkConfig);
        break;
    case "feishu":
        this.applicationService.getResponse('update_feishu_config', function(obj: FeishuConfig){
            self.feishuConfig = obj;
          }, 0, this.feishuConfig);
        break;
    case "ldap":
        this.applicationService.getResponse('update_ldap_config', function(obj: LDAPConfig){
            self.ldapConfig = obj;
          }, 0, this.ldapConfig);
        break;
    case "cas2":
        this.applicationService.getResponse('update_cas2_config', function(obj: CAS2Config){
            self.cas2Config = obj;
          }, 0, this.cas2Config);
        break;
    }
  }

  changeEditable() {
    this.readOnlyValue = !this.readOnlyValue;
    if(this.readOnlyValue) {
      this.readOnlyButtonText="Edit";
    } else {
      this.readOnlyButtonText="Cancel";
    }
  }

}
