import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../application.service'; 
import { MessageService } from '../message.service';
import { GroupPolicy,APIResponse,ChkPoint,PolicyAction,RegexMatch, CheckItem, Operation } from '../models';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {
  group_policy: GroupPolicy;
  readOnlyValue: boolean = true;
  readOnlyButtonText: string = "Edit";
  regex_match: RegexMatch=new RegexMatch();
  enum_check_values:  {value: number; name: string}[] = [];//number[]=[];
  enum_operation_values:  {value: number; name: string}[] = [];//number[]=[];
  enum_action_values: {value: number; name: string}[] = [];//number[]=[];

  constructor(private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private router: Router,
    private messageService: MessageService) { }

  getGroupPolicy(app_id?:number) {
    const id = +this.route.snapshot.paramMap.get('id');
    if(id==0) {
      // new policy
      this.readOnlyValue = false;
      this.group_policy=new GroupPolicy();
      this.group_policy.id=0;
      if(app_id!=null) this.group_policy.app_id=app_id;
      else this.group_policy.app_id=0;
      this.group_policy.action=PolicyAction.Block;
      this.group_policy.description="Custom";
      this.group_policy.check_items=[];
      this.addCheckItem();
      this.group_policy.is_enabled=true;      
      this.readOnlyButtonText="Cancel";
    } else {
      var self=this;
      this.applicationService.getResponse('getgrouppolicy', function(obj: GroupPolicy){
        self.group_policy = obj;
        self.regex_match.pattern = self.group_policy.check_items[0].regex_policy;        
      },id);
    } 
    this.regex_match.preprocess=true;  
  }

  setGroupPolicy() {
    var self=this;
    this.applicationService.getResponse('updategrouppolicy', function(obj: GroupPolicy){
      let new_id = obj.id;
      if(self.group_policy.id == new_id)  {
        self.group_policy = obj;
      }       
      else {
        self.group_policy = obj;
        self.router.navigate(['/policy/'+ new_id]);
      }
      self.readOnlyValue = true;
      self.readOnlyButtonText="Edit";
      self.messageService.add("Policy Saved.");
    }, null, self.group_policy);
  }

  

  ngOnInit() {
    this.getGroupPolicy();
    if(this.applicationService.applications.length==0) {
      this.applicationService.getApplications();
    }
    if(this.applicationService.vulntypes.length==0) {
      this.applicationService.getVulnTypes(function(){});
    }
    //init Check Points enum
    /*
    var enum_keys_values = Object.values(ChkPoint);    
    var check_length = (enum_keys_values.length)/2;
    this.enum_check_values = enum_keys_values.slice(check_length);
    */
   for(var n in ChkPoint) {
        if (typeof ChkPoint[n] == 'number') {
            this.enum_check_values.push({value: <any>ChkPoint[n], name: n});
        }
    }
    //init Operation enum
    /*
    var enum_operation_keys_values = Object.values(Operation);
    var operation_length=(enum_operation_keys_values.length)/2;
    this.enum_operation_values = enum_operation_keys_values.slice(operation_length);
    */
   for(var n in Operation) {
    if (typeof Operation[n] == 'number') {
        this.enum_operation_values.push({value: <any>Operation[n], name: n});
    }
}
    //init Action enum
    /*
    var enum_policy_action_values = Object.values(PolicyAction);
    var action_length = (enum_policy_action_values.length)/2;
    this.enum_action_values = enum_policy_action_values.slice(action_length);  
    */
   for(var n in PolicyAction) {
    if (typeof PolicyAction[n] == 'number') {
        this.enum_action_values.push({value: <any>PolicyAction[n], name: n});
    }
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

  getChkPointEnumString(value: number) {
    return ChkPoint[value];
  }

  getOperationEnumString(value: number) {
    return Operation[value];
  }

  getPolicyActionEnumString(value: number) {
    return PolicyAction[value];
  }

  getDate(unix: number): string {
    return new Date(unix*1000).toLocaleString('zh-CN', {hour12: false});
  }

  testRegex(){
    this.regex_match.matched=null;
    var self=this;
    this.applicationService.getResponse('testregex', function(obj: RegexMatch){      
        self.regex_match = obj;
    }, null, self.regex_match);
  }

  addCheckItem() {
    if(this.readOnlyValue) return;
    var new_check_item = new CheckItem();
    new_check_item.id=0;
    new_check_item.operation=Operation.Regex_Match;
    new_check_item.key_name="";
    new_check_item.regex_policy="";
    new_check_item.group_policy_id=this.group_policy.id;
    this.group_policy.check_items.push(new_check_item);
  }

  delCheckItem(i: number) {
    if(this.readOnlyValue) return;
    if(this.group_policy.check_items.length==1) {
      alert("At least one checkpoint is required!");
      return;
    }
    this.group_policy.check_items.splice(i,1);
  }

  delGroupPolicy() {
    if(this.readOnlyValue) return;
    var self=this;
    this.applicationService.getResponse('delgrouppolicy', function(){        
      self.router.navigate(['/waf']);
      self.messageService.add("Policy Deleted.");
    }, this.group_policy.id, null);
  }

}
