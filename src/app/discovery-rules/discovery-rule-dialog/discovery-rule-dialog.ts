import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { DiscoveryRule } from '../../models/gateway';
import { RegexMatch } from '../../models/security';
import { RPCService } from '../../services/rpc.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

export interface IData {
  discoveryRule: DiscoveryRule
}

@Component({
  selector: 'app-discovery-rule-dialog',
  imports: [
    FormsModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './discovery-rule-dialog.html',
  styleUrl: './discovery-rule-dialog.css'
})
export class DiscoveryRuleDialog {
  public discovery_rule: DiscoveryRule;

  regex_match: RegexMatch = {
    pattern: '',
    payload: '',
    matched: null,
    preprocess: false
  };

  constructor(
    public rpcService: RPCService,
    public cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<DiscoveryRuleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IData) {

    this.discovery_rule = data.discoveryRule;
  }

  checkRegex() {
    this.regex_match.matched = null;
    this.regex_match.preprocess = false;
    this.regex_match.payload = this.discovery_rule.sample;
    this.regex_match.pattern = this.discovery_rule.regex;
    var self = this;
    if (this.regex_match.payload.length == 0 || this.regex_match.pattern.length == 0) return;
    this.rpcService.getResponse('test_regex', function (obj: RegexMatch) {
      if (obj != null) {
        self.regex_match = obj;
        self.cdr.detectChanges();
      }
    }, null, self.regex_match);
  }

  saveDiscoveryRule() {
    if (this.regex_match.matched !== true) {
      return;
    }
    let self = this;
    this.rpcService.getResponse('update_discovery_rule', function (obj: DiscoveryRule) {
      self.discovery_rule = obj;
      self.dialogRef.close();
    }, this.discovery_rule.id, this.discovery_rule);

  }

}
