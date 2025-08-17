import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { RPCService } from '../../services/rpc.service';
import { CCLog, PolicyAction } from '../../models/security';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';


export interface IData {
  ccLog: CCLog
}

@Component({
  selector: 'app-cc-log-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './cc-log-dialog.html',
  styleUrl: './cc-log-dialog.css'
})
export class CCLogDialog {

  ccLog: CCLog | null = null;

  constructor(
    private rpcService: RPCService,
    public cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<CCLogDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IData) {
    let simpleLog = data.ccLog;
    var self = this;
    this.rpcService.getResponse('get_cc_log', function (obj: CCLog) {
      self.ccLog = obj;
      self.cdr.detectChanges();
    }, simpleLog.id);
  }

  getDate(unix: number): string {
    return this.rpcService.getDateString(unix);
  }

  getPolicyActionEnumString(value: number) {
    return PolicyAction[value];
  }
}
