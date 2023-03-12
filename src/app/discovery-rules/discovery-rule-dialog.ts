import { Component, OnInit, Inject } from '@angular/core';
import { DiscoveryRule, RegexMatch } from '../models';
import { ApplicationService } from '../application.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { tap, startWith, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';

export interface IDiscoveryRule {
    discovery_rule: DiscoveryRule
}
@Component({
    selector: 'discovery-rule-dialog',
    templateUrl: './discovery-rule-dialog.html',
    styleUrls: ['./discovery-rule-dialog.css']
})
export class DiscoveryRuleDialog {
    public discovery_rule: DiscoveryRule;
    regex_match: RegexMatch = new RegexMatch();

    constructor(
        public applicationService: ApplicationService,
        public dialogRef: MatDialogRef<DiscoveryRuleDialog>,
        @Inject(MAT_DIALOG_DATA) public data: IDiscoveryRule) {
        this.discovery_rule = data.discovery_rule;
    }

    testRegex() {
        this.regex_match.matched = null;
        this.regex_match.preprocess = false;
        this.regex_match.payload = this.discovery_rule.sample;
        this.regex_match.pattern = this.discovery_rule.regex;
        var self = this;
        if (this.regex_match.payload.length == 0 || this.regex_match.pattern.length == 0) return;
        this.applicationService.getResponse('test_regex', function (obj: RegexMatch) {
            if (obj != null) self.regex_match = obj;
        }, null, self.regex_match);
    }

    saveDiscoveryRule() {
        var self = this;
        this.applicationService.getResponse('update_discovery_rule', function (obj: DiscoveryRule) {
            self.discovery_rule = obj;
        }, this.discovery_rule.id, this.discovery_rule);
        this.dialogRef.close();
    }


}