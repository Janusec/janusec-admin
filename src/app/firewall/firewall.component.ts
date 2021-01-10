import { Component, OnInit,ViewChild } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CCPolicy,APIResponse } from '../models';
import { MessageService } from '../message.service';
import { Application,GroupPolicy,PolicyAction,IPPolicy } from '../models';
import { ApplicationService } from '../application.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-firewall',
  templateUrl: './firewall.component.html',
  styleUrls: ['./firewall.component.css']
})
export class FirewallComponent implements OnInit {
  global_cc_policy: CCPolicy;
  app_cc_policy: CCPolicy;
  selected_app_id : number;
  application: Application;
  has_custom_cc_policy: boolean = false; 
  is_new_policy:boolean =false;
  global_regex_policies: GroupPolicy[] = [];  
  custom_regex_policies: GroupPolicy[] = [];
  enum_action_values: {value: number; name: string}[] = [];//number[]=[];

  globalRegexDataSource: MatTableDataSource<GroupPolicy>;
  displayedColumns = ['id', 'description', 'is_enabled'];
  regexLength: number;
  regexPageIndex: number;

  ipPolicyDataSource: MatTableDataSource<IPPolicy>;
  ipDisplayedColumns = ['ip_addr', 'is_allow', 'apply_to_waf', 'apply_to_cc', 'editable'];
  ip_policies: IPPolicy[] = [];
  ipPageLength: number;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('ipPaginator') ipPaginator: MatPaginator;

  constructor(public messageService: MessageService,
    public applicationService: ApplicationService,
    private router: Router) {
        this.global_cc_policy=new(CCPolicy);
        this.app_cc_policy=new(CCPolicy);
        if (this.applicationService.auth_user.logged) {
          if(this.applicationService.applications.length==0) {
            this.applicationService.getApplications();
          }
          if(this.applicationService.vulntypes.length==0) {
            this.applicationService.getVulnTypes(function(){});
          }
          this.getGroupPolicies(0);
          this.getCCPolicy(0);
          this.getIPPolicies();
        }        
  }

  ngOnInit() {
    if (this.applicationService.auth_user.logged==false) {
      this.router.navigate(['/']);
      return
    } 
    if (this.applicationService.auth_user.need_modify_pwd) {
      this.router.navigate(['/appuser/'+this.applicationService.auth_user.user_id]);
    } 
    for(var n in PolicyAction) {
        if (typeof PolicyAction[n] == 'number') {
            this.enum_action_values.push({value: <any>PolicyAction[n], name: n});
        }
  }
}

  getCCPolicy(id: number) {
    var self = this;
    this.applicationService.getResponse('get_cc_policy', function(obj: CCPolicy){
        if(obj == null) return;
        if(id==0) {
            self.global_cc_policy = obj;
        } else {
            self.app_cc_policy =obj;
            if(self.app_cc_policy.app_id!=0) {
            self.has_custom_cc_policy=true;
            } else {
            if(self.is_new_policy) self.has_custom_cc_policy=true;
            else self.has_custom_cc_policy=false;
            }
        } 
        self.is_new_policy=false;
        },id);
  }

  newCCPolicy(app_id: number) {
    this.is_new_policy=true;
    this.has_custom_cc_policy=true;
    this.app_cc_policy.app_id = app_id;
  }

  updateCCPolicy(app_id: number) {
    var cc_policy: CCPolicy;
    if(app_id==0) {
      cc_policy = this.global_cc_policy;
    } else {
      cc_policy = this.app_cc_policy;
      if(cc_policy.app_id != app_id) {
        cc_policy.app_id=app_id;
      }
    }
    let self=this;
    this.applicationService.getResponse('update_cc_policy', function(){
      self.messageService.add("CC policy updated!");  
    },app_id,cc_policy);
  }

  deleteCCPolicy(app_id: number) {
    if(app_id==0) return;
    this.has_custom_cc_policy=false;
    let self=this;
    this.applicationService.getResponse('del_cc_policy', function(){
      self.messageService.add("CC policy deleted!");  
    },app_id,null);
  }

  onSelectApp() {
    var self = this;
    this.applicationService.getResponse('get_app', function(obj:Application){
        if(obj != null) self.application = obj;
    },this.selected_app_id);    
    this.getCCPolicy(this.selected_app_id);
    this.is_new_policy=false; 
  }

  getGroupPolicies(app_id: number) {
    var self = this;
    this.applicationService.getResponse('get_group_policies', function(obj: GroupPolicy[]){
        if(obj == null) return;
        if(app_id==0) {
            self.global_regex_policies =  obj;
            self.globalRegexDataSource = new MatTableDataSource<GroupPolicy>(self.global_regex_policies);
            self.globalRegexDataSource.paginator = self.paginator;
            self.regexLength = self.global_regex_policies.length;
            self.paginator.pageIndex = 0;
        }
        else self.custom_regex_policies = obj;
    }, app_id);
  }

  getVulnNameByID(vuln_id:number) {
    return this.applicationService.vulntypemap[vuln_id];
  }

  newGroupPolicy() {
    this.router.navigate(['/policy/0']);
  }

  getIPPolicies() {
    var self = this;
    this.applicationService.getResponse('get_ip_policies', function(obj: IPPolicy[]){
        self.ip_policies =  obj;
        self.ipPolicyDataSource = new MatTableDataSource<IPPolicy>(self.ip_policies);
        self.ipPolicyDataSource.paginator = self.ipPaginator;
        self.ipPaginator.pageIndex = 0;
        self.ipPageLength = self.ip_policies.length;
    });
  }

  addIPPolicy() {
    let ip_policy = new IPPolicy();
    ip_policy.id = 0;
    ip_policy.ip_addr = "127.0.0.1";
    ip_policy.is_allow = true;
    ip_policy.apply_to_waf = true;
    ip_policy.apply_to_cc = true;
    ip_policy.editable = true;
    this.ip_policies.splice(0, 0, ip_policy);
    this.ipPolicyDataSource.data=this.ip_policies;
    //
  }

  saveIP(index: number) {
    let self = this;
    let ip_policy = this.ip_policies[index];
    this.applicationService.getResponse('update_ip_policy', function(obj: IPPolicy){
        self.ip_policies[index] = obj;
        self.ip_policies[index].editable = false;
        self.ipPolicyDataSource.data=self.ip_policies;
    }, 0, ip_policy);

  }

  deleteIP(index: number) {
      let self =this;
      let ip_policy = this.ip_policies[index];
      if(ip_policy.id==0) {
        self.ip_policies.splice(index, 1);
        self.ipPolicyDataSource.data=self.ip_policies;
      } else {
        this.applicationService.getResponse('del_ip_policy', function(){
            self.ip_policies.splice(index, 1);
            self.ipPolicyDataSource.data=self.ip_policies;
      },ip_policy.id, null);
    }
  }

}