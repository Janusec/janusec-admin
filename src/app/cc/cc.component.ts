import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CCPolicy, APIResponse } from '../models';
import { MessageService } from '../message.service';
import { Application, GroupPolicy, PolicyAction, IPPolicy } from '../models';
import { ApplicationService } from '../application.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-cc',
    templateUrl: './cc.component.html',
    styleUrls: ['./cc.component.css']
})
export class CcComponent implements OnInit {

    global_cc_policy: CCPolicy;
    app_cc_policy: CCPolicy;
    selected_app_id: number;
    application: Application;
    has_custom_cc_policy: boolean = false;
    is_new_policy: boolean = false;
    enum_action_values: { value: number; name: string }[] = [];//number[]=[];

    constructor(public messageService: MessageService,
        public applicationService: ApplicationService,
        private router: Router) {
        this.global_cc_policy = new (CCPolicy);
        this.app_cc_policy = new (CCPolicy);
        if (this.applicationService.auth_user.logged) {
            if (this.applicationService.applications.length == 0) {
                this.applicationService.getApplications();
            }
            if (this.applicationService.vulntypes.length == 0) {
                this.applicationService.getVulnTypes(function () { });
            }
            this.getCCPolicy(0);
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

    getCCPolicy(id: number) {
        var self = this;
        this.applicationService.getResponse('get_cc_policy', function (obj: CCPolicy) {
            if (obj == null) return;
            if (id == 0) {
                self.global_cc_policy = obj;
            } else {
                self.app_cc_policy = obj;
                if (self.app_cc_policy.app_id != 0) {
                    self.has_custom_cc_policy = true;
                } else {
                    if (self.is_new_policy) self.has_custom_cc_policy = true;
                    else self.has_custom_cc_policy = false;
                }
            }
            self.is_new_policy = false;
        }, id);
    }

    newCCPolicy(app_id: number) {
        this.is_new_policy = true;
        this.has_custom_cc_policy = true;
        this.app_cc_policy.app_id = app_id;
    }

    updateCCPolicy(app_id: number) {
        var cc_policy: CCPolicy;
        if (app_id == 0) {
            cc_policy = this.global_cc_policy;
        } else {
            cc_policy = this.app_cc_policy;
            if (cc_policy.app_id != app_id) {
                cc_policy.app_id = app_id;
            }
        }
        let self = this;
        this.applicationService.getResponse('update_cc_policy', function () {
            self.messageService.add("CC policy updated!");
        }, app_id, cc_policy);
    }

    deleteCCPolicy(app_id: number) {
        if (app_id == 0) return;
        this.has_custom_cc_policy = false;
        let self = this;
        this.applicationService.getResponse('del_cc_policy', function () {
            self.messageService.add("CC policy deleted!");
        }, app_id, null);
    }

    onSelectApp() {
        var self = this;
        this.applicationService.getResponse('get_app', function (obj: Application) {
            if (obj != null) self.application = obj;
        }, this.selected_app_id);
        this.getCCPolicy(this.selected_app_id);
        this.is_new_policy = false;
    }

    getVulnNameByID(vuln_id: number) {
        return this.applicationService.vulntypemap[vuln_id];
    }

}
