import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../application.service'; 
import { Settings, WxworkConfig } from '../models';
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

  constructor(private applicationService: ApplicationService,
    private messageService: MessageService) { }

  ngOnInit() {
      let self = this;
      this.applicationService.getResponse('get_global_settings', function(obj: Settings){
          self.settings = obj;
          
          
      });
  }

  onChangeAuthProvider() {
      console.log("onChangeAuthProvider", this.settings);
      let self =this;
      switch(this.settings.auth_provider) {
        case "wxwork":                  
            this.applicationService.getResponse('get_wxwork_config', function(obj: WxworkConfig){
              self.wxworkConfig = obj;
              console.log("get_wxwork_config", self.wxworkConfig);
            })
            break;
        case "dingtalk":
            break;
        case "feishu":
            break;
        case "ldap":
            break;
        case "cas2":
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
