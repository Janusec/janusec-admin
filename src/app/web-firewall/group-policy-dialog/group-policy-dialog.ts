import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RPCService } from '../../services/rpc.service';
import { MessageService } from '../../services/message.service';
import { GroupPolicy, ChkPoint, PolicyAction, RegexMatch, CheckItem, Operation, VulnType } from '../../models/security';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';


export interface IData {
  groupPolicy: GroupPolicy
}

@Component({
  selector: 'app-group-policy-dialog',
  imports: [
    FormsModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatDialogActions,
    MatDialogClose,
    MatCheckboxModule
  ],
  templateUrl: './group-policy-dialog.html',
  styleUrl: './group-policy-dialog.css'
})
export class GroupPolicyDialog {
  groupPolicy: GroupPolicy = {
    id: '0',
    app_id: '0',
    description: 'Rule 1',
    vuln_id: 0,
    check_items: [],
    hit_value: 0,
    action: PolicyAction.BLOCK,
    is_enabled: true,
    update_time: 0,
    unique_hash: ''
  };
  readOnlyValue: boolean = true;
  readOnlyButtonText: string = "Edit";
  regexMatch: RegexMatch = {
    pattern: '',
    payload: '',
    matched: false,
    preprocess: true
  };

  chkpointHeadValue: number = ChkPoint.HeaderValue;

  chkPointEntries: [string, string | ChkPoint][] = [];
  operationEntries: [string, string | Operation][] = [];
  policyActionEntries: [string, string | PolicyAction][] = [];

  constructor(private route: ActivatedRoute,
    public rpcService: RPCService,
    private cdr: ChangeDetectorRef,
    //private router: Router,
    private msgService: MessageService,
    public dialogRef: MatDialogRef<GroupPolicyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IData) {
    if (data.groupPolicy !== null) {
      this.groupPolicy = data.groupPolicy;
      this.regexMatch.pattern = this.groupPolicy.check_items[0].regex_policy;
    } else {
      this.readOnlyValue = false;
      this.addCheckItem();
      this.readOnlyButtonText = "Cancel";
    }
    this.chkPointEntries = Object.entries(ChkPoint).filter(
      ([key, value]) => typeof value === 'number'
    );
    this.operationEntries = Object.entries(Operation).filter(
      ([key, value]) => typeof value === 'number'
    );
    this.policyActionEntries = Object.entries(PolicyAction).filter(
      ([key, value]) => typeof value === 'number'
    );
    if (this.rpcService.vulnTypes$().length === 0) {
      this.rpcService.getVulnTypes(() => { });
    }
    if (this.rpcService.applications$().length === 0) {
      this.rpcService.getApplications(() => { });
    }
  }

  setGroupPolicy() {
    var self = this;
    this.rpcService.getResponse('update_group_policy', function (obj: GroupPolicy) {
      if (obj != null) {
        self.rpcService.addOrUpdateLocalGroupPolicy(obj)
        self.msgService.addSuccessMessage("WAF rule " + obj.description + " saved.");
        self.dialogRef.close();
      }
    }, null, self.groupPolicy);
  }

  changeEditable() {
    this.readOnlyValue = !this.readOnlyValue;
    if (this.readOnlyValue) {
      this.readOnlyButtonText = "Edit";
    } else {
      this.readOnlyButtonText = "Cancel";
    }
  }

  getDate(unix: number): string {
    return this.rpcService.getDateString(unix);
  }

  testRegex() {
    this.regexMatch.matched = false;
    var self = this;
    this.rpcService.getResponse('test_regex', function (obj: RegexMatch) {
      if (obj != null) {
        self.regexMatch = obj;
        self.cdr.detectChanges();
      }
    }, null, self.regexMatch);
  }

  addCheckItem() {
    if (this.readOnlyValue) return;
    var new_check_item: CheckItem = {
      id: '0',
      operation: Operation.Regex_Match,
      key_name: "",
      regex_policy: "",
      check_point: ChkPoint.GetPostValue,
      group_policy_id: this.groupPolicy.id
    }
    this.groupPolicy.check_items.push(new_check_item);
  }

  delCheckItem(i: number) {
    if (this.readOnlyValue) return;
    if (this.groupPolicy.check_items.length == 1) {
      alert("At least one checkpoint is required!");
      return;
    }
    this.groupPolicy.check_items.splice(i, 1);
  }

}

