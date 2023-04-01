import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CCPolicy, APIResponse } from '../models';
import { MessageService } from '../message.service';
import { Application, GroupPolicy, PolicyAction, IPPolicy } from '../models';
import { RPCService } from '../rpc.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { of } from 'rxjs';
import * as cryptojs from 'crypto-js';

@Component({
    selector: 'app-waf',
    templateUrl: './waf.component.html',
    styleUrls: ['./waf.component.css']
})
export class WAFComponent implements OnInit {
    global_cc_policy: CCPolicy;
    app_cc_policy: CCPolicy;
    selected_app_id: string;
    application: Application;
    has_custom_cc_policy: boolean = false;
    is_new_policy: boolean = false;
    group_policies: GroupPolicy[] = [];
    enum_action_values: { value: number; name: string }[] = [];//number[]=[];

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
        public rpcService: RPCService,
        private router: Router) {
        this.global_cc_policy = new (CCPolicy);
        this.app_cc_policy = new (CCPolicy);
        if (this.rpcService.auth_user.logged) {
            if (this.rpcService.applications.length == 0) {
                this.rpcService.getApplications();
            }
            if (this.rpcService.vulntypes.length == 0) {
                this.rpcService.getVulnTypes(function () { });
            }
            this.getGroupPolicies();
        }
    }

    ngOnInit() {
        if (this.rpcService.auth_user.logged == false) {
            this.router.navigate(['/']);
            return
        }
        if (this.rpcService.auth_user.need_modify_pwd) {
            this.router.navigate(['/appuser/' + this.rpcService.auth_user.user_id]);
        }
        for (var n in PolicyAction) {
            if (typeof PolicyAction[n] == 'number') {
                this.enum_action_values.push({ value: <any>PolicyAction[n], name: n });
            }
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
        }, id);
    }

    newCCPolicy(app_id: string) {
        this.is_new_policy = true;
        this.has_custom_cc_policy = true;
        this.app_cc_policy.app_id = app_id;
    }

    updateCCPolicy(app_id: string) {
        var cc_policy: CCPolicy;
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
            self.messageService.add("CC policy updated!");
        }, app_id, cc_policy);
    }

    deleteCCPolicy(app_id: string) {
        if (app_id == '0') return;
        this.has_custom_cc_policy = false;
        let self = this;
        this.rpcService.getResponse('del_cc_policy', function () {
            self.messageService.add("CC policy deleted!");
        }, app_id, null);
    }

    onSelectApp() {
        var self = this;
        this.rpcService.getResponse('get_app', function (obj: Application) {
            if (obj != null) self.application = obj;
        }, this.selected_app_id);
        this.getCCPolicy(this.selected_app_id);
        this.is_new_policy = false;
    }

    getGroupPolicies() {
        var self = this;
        this.rpcService.getResponse('get_group_policies', function (obj: GroupPolicy[]) {
            if (obj == null) return;
            self.group_policies = obj;
            for (let group_policy of self.group_policies) {
                group_policy.unique_hash = self.calcUniqueHash(group_policy);
            }
            self.globalRegexDataSource = new MatTableDataSource<GroupPolicy>(self.group_policies);
            self.globalRegexDataSource.paginator = self.paginator;
            self.regexLength = self.group_policies.length;
            self.paginator.pageIndex = 0;
        });
    }

    getVulnNameByID(vuln_id: number) {
        return this.rpcService.vulntypemap[vuln_id];
    }

    newGroupPolicy() {
        this.router.navigate(['/policy/0']);
    }

    applyFilter(filterValue: string) {
        this.globalRegexDataSource.filter = filterValue.trim().toLowerCase();
    }

    dynamicDownload = null as HTMLElement;
    exportWAF() {
        of(this.group_policies).subscribe(res => {
            let jsonStr = JSON.stringify(res);
            this.dynamicDownload = document.createElement('a');
            const fileType = 'text/json';
            this.dynamicDownload.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(jsonStr)}`);
            this.dynamicDownload.setAttribute('download', 'JANUSEC-WAF.json');
            var event = new MouseEvent("click");
            this.dynamicDownload.dispatchEvent(event);
        });
    }

    @ViewChild('fileInput') fileInput: ElementRef;
    importWAF() {
        this.fileInput.nativeElement.click();
    }

    readFile(event) {
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
                let jsonStr = fileReader.result as string;
                let mgmtCategories: GroupPolicy[] = JSON.parse(jsonStr);
                this.importWAFData(mgmtCategories);
            }
            fileReader.readAsText(file)
        }
    }

    importWAFData(groupPolicies: GroupPolicy[]) {
        for (let groupPolicy of groupPolicies) {
            // first check whether the group policy is already existed
            if (this.isInCurrentGroupPolicies(groupPolicy)) {
                continue;
            }
            // second save it if not exists.
            groupPolicy.id = '0';
            this.setGroupPolicy(groupPolicy);
        }
        setTimeout(() => {
            this.getGroupPolicies();
            this.messageService.add("Import WAF policies finished!");
        }, 3000);
    }

    isInCurrentGroupPolicies(newGroupPolicy: GroupPolicy) {
        let unique_hash = this.calcUniqueHash(newGroupPolicy);
        for (let groupPolicy of this.group_policies) {
            if (unique_hash == groupPolicy.unique_hash) return true;
        }
        return false;
    }

    calcUniqueHash(groupPolicy: GroupPolicy) {
        let preHashString = "" + groupPolicy.app_id + groupPolicy.description + groupPolicy.vuln_id + groupPolicy.hit_value + groupPolicy.action;
        for (let check_item of groupPolicy.check_items) {
            preHashString += "^" + check_item.check_point + check_item.operation + check_item.key_name + check_item.regex_policy;
        }
        let hash = String(cryptojs.SHA256(preHashString));
        return hash;
    }

    setGroupPolicy(group_policy: GroupPolicy) {
        var self = this;
        this.rpcService.getResponse('update_group_policy', function (obj: GroupPolicy) {
            if (obj == null) return;
            group_policy = obj;
            for (let check_item of group_policy.check_items) {
                check_item.id = '0';
                check_item.group_policy_id = group_policy.id;
            }
        }, null, group_policy);
    }
}