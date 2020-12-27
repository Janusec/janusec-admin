import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../application.service'; 
import { Settings } from '../models';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings : Settings;
  readOnlyValue: boolean = true;
  readOnlyButtonText: string = "Edit"

  constructor(private applicationService: ApplicationService,
    private messageService: MessageService) { }

  ngOnInit() {
      let self = this;
      this.applicationService.getResponse('get_global_settings', function(obj: Settings){
          self.settings = obj;
      });
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
