import { Component, OnInit, ViewChild } from '@angular/core';
import { DiscoveryRuleDialog } from './discovery-rule-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DiscoveryRule } from '../models';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-discovery-rules',
  templateUrl: './discovery-rules.component.html',
  styleUrls: ['./discovery-rules.component.css']
})
export class DiscoveryRulesComponent implements OnInit {

  discovery_rules: DiscoveryRule[] = [];
  discoveryRulesDataSource: MatTableDataSource<DiscoveryRule>;
  displayedColumns = ['field_name', 'sample', 'regex', 'description', 'action'];

  @ViewChild('rulesPaginator') rulesPaginator: MatPaginator;
  constructor(private applicationService: ApplicationService,
    public dialog: MatDialog) {

    this.getDiscoveryRules();
  }

  ngOnInit(): void {
  }

  // Data Discovery

  addDataDiscoveryRule() {
    let discovery_rule: DiscoveryRule = {
      id: 0,
      field_name: "",
      sample: "",
      regex: "",
      description: "",
      editor: this.applicationService.auth_user.username,
      update_time: 0
    };
    this.editDataDiscoveryRule(discovery_rule);
  }

  editDataDiscoveryRule(discovery_rule: DiscoveryRule) {
    const dialogRef = this.dialog.open(DiscoveryRuleDialog, {
      width: '500px',
      data: { "discovery_rule": discovery_rule }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getDiscoveryRules();
    });
  }

  getDiscoveryRules() {
    let self = this;
    this.applicationService.getResponse("get_discovery_rules", function (objs: DiscoveryRule[]) {
      if (objs == null) objs = [];
      self.discovery_rules = objs;
      self.discoveryRulesDataSource = new MatTableDataSource<DiscoveryRule>(self.discovery_rules);
      self.discoveryRulesDataSource.paginator = self.rulesPaginator;
    });
  }

  deleteDataDiscoveryRule(discovery_rule: DiscoveryRule) {
    if (!confirm("Are you sure to delete discovery rule for: " + discovery_rule.field_name + "?")) return;
    let self = this;
    this.applicationService.getResponse("del_discovery_rule", function (objs: DiscoveryRule[]) {
      // refresh
      self.getDiscoveryRules();
    }, discovery_rule.id);
  }

}
