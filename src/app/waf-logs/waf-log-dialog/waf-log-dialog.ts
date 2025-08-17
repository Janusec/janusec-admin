import { ChangeDetectorRef, Component, Inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RPCService } from '../../services/rpc.service';
import { RegexHitLog, PolicyAction, GroupPolicy } from '../../models/security';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GroupPolicyDialog } from '../../web-firewall/group-policy-dialog/group-policy-dialog';

export interface IData {
  simpleLog: RegexHitLog
}

@Component({
  selector: 'app-waf-log-dialog',
  imports: [
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './waf-log-dialog.html',
  styleUrl: './waf-log-dialog.css'
})
export class WAFLogDialog {
  regexLog: RegexHitLog | null = null;
  groupPolicy: GroupPolicy | null = null;

  constructor(private route: ActivatedRoute,
    private rpcService: RPCService,
    public cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<WAFLogDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IData) {
    let logID = data.simpleLog.id;
    var self = this;
    this.rpcService.getResponse('get_regex_log', function (obj: RegexHitLog) {
      self.regexLog = obj;
      self.cdr.detectChanges();
    }, logID);
  }

  getDate(unix: number): string {
    return this.rpcService.getDateString(unix);
  }

  getPolicyActionEnumString(value: number) {
    return PolicyAction[value];
  }


  openGroupPolicyDialog(policyID: string) {
    let self = this;
    this.rpcService.getResponse('get_group_policy', function (obj: GroupPolicy) {
      self.groupPolicy = obj;
      if (self.groupPolicy !== null) {
        self.dialog.open(GroupPolicyDialog, {
          width: '900px',
          maxWidth: '1000px',
          data: { "groupPolicy": self.groupPolicy }
        });
      }
    }, policyID);
  }

}
