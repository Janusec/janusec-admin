import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CCPolicy, APIResponse } from '../models';
import { MessageService } from '../message.service';
import { Application, GroupPolicy, PolicyAction, IPPolicy } from '../models';
import { ApplicationService } from '../application.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-ip-policy',
    templateUrl: './ip-policy.component.html',
    styleUrls: ['./ip-policy.component.css']
})
export class IpPolicyComponent implements OnInit {

    enum_action_values: { value: number; name: string }[] = [];//number[]=[];

    ipPolicyDataSource: MatTableDataSource<IPPolicy>;
    ipDisplayedColumns = ['ip_addr', 'is_allow', 'apply_to_waf', 'apply_to_cc', 'editable'];
    ip_policies: IPPolicy[] = [];
    ipPageLength: number;
    @ViewChild('ipPaginator') ipPaginator: MatPaginator;

    constructor(public messageService: MessageService,
        public applicationService: ApplicationService,
        private router: Router) {
        if (this.applicationService.auth_user.logged) {
            if (this.applicationService.applications.length == 0) {
                this.applicationService.getApplications();
            }
            if (this.applicationService.vulntypes.length == 0) {
                this.applicationService.getVulnTypes(function () { });
            }
            this.getIPPolicies();
        }
    }

    ngOnInit() {
        if (this.applicationService.auth_user.logged == false) {
            this.router.navigate(['/']);
            return
        }
        if (this.applicationService.auth_user.need_modify_pwd) {
            this.router.navigate(['/appuser/' + this.applicationService.auth_user.user_id]);
        }
        for (var n in PolicyAction) {
            if (typeof PolicyAction[n] == 'number') {
                this.enum_action_values.push({ value: <any>PolicyAction[n], name: n });
            }
        }
    }

    getIPPolicies() {
        var self = this;
        this.applicationService.getResponse('get_ip_policies', function (obj: IPPolicy[]) {
            self.ip_policies = obj;
            self.ipPolicyDataSource = new MatTableDataSource<IPPolicy>(self.ip_policies);
            self.ipPolicyDataSource.paginator = self.ipPaginator;
            self.ipPaginator.pageIndex = 0;
            self.ipPageLength = self.ip_policies.length;
        });
    }

    addIPPolicy() {
        let ip_policy = new IPPolicy();
        ip_policy.id = '0';
        ip_policy.ip_addr = "127.0.0.1";
        ip_policy.is_allow = true;
        ip_policy.apply_to_waf = true;
        ip_policy.apply_to_cc = true;
        ip_policy.editable = true;
        this.ip_policies.splice(0, 0, ip_policy);
        this.ipPolicyDataSource.data = this.ip_policies;
        //
    }

    saveIP(index: number) {
        let self = this;
        let ip_policy = this.ip_policies[index];
        this.applicationService.getResponse('update_ip_policy', function (obj: IPPolicy) {
            self.ip_policies[index] = obj;
            self.ip_policies[index].editable = false;
            self.ipPolicyDataSource.data = self.ip_policies;
        }, '0', ip_policy);

    }

    deleteIP(index: number) {
        let self = this;
        let ip_policy = this.ip_policies[index];
        if (ip_policy.id == '0') {
            self.ip_policies.splice(index, 1);
            self.ipPolicyDataSource.data = self.ip_policies;
        } else {
            this.applicationService.getResponse('del_ip_policy', function () {
                self.ip_policies.splice(index, 1);
                self.ipPolicyDataSource.data = self.ip_policies;
            }, ip_policy.id, null);
        }
    }

}
