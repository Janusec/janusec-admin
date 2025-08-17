import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DiscoveryRuleDialog } from './discovery-rule-dialog/discovery-rule-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DiscoveryRule } from '../models/gateway';
import { RPCService } from '../services/rpc.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-discovery-rules',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIcon
  ],
  templateUrl: './discovery-rules.html',
  styleUrl: './discovery-rules.css'
})
export class DiscoveryRules {

  discovery_rules: DiscoveryRule[] = [];
  dataSource = new MatTableDataSource<DiscoveryRule>();
  displayedColumns = ['field_name', 'sample', 'regex', 'description', 'action'];

  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(public rpcService: RPCService,
    public cdr: ChangeDetectorRef,
    public dialog: MatDialog) {

    this.getDiscoveryRules();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDiscoveryRuleDialog(discoveryRule: DiscoveryRule | null) {
    if (discoveryRule === null) {
      discoveryRule = {
        id: '0',
        field_name: "",
        sample: "",
        regex: "",
        description: "",
        editor: this.rpcService.authUser$().username,
        update_time: 0
      };
    }
    const dialogRef = this.dialog.open(DiscoveryRuleDialog, {
      width: '500px',
      disableClose: true,
      data: { "discoveryRule": { ...discoveryRule } }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getDiscoveryRules();
    });
  }

  getDiscoveryRules() {
    let self = this;
    this.rpcService.getResponse("get_discovery_rules", function (objs: DiscoveryRule[]) {
      if (objs == null) objs = [];
      self.discovery_rules = objs;
      self.dataSource.data = self.discovery_rules;
      self.cdr.detectChanges();
    });
  }

  deleteDataDiscoveryRule(discovery_rule: DiscoveryRule) {
    if (!confirm("Are you sure to delete discovery rule for: " + discovery_rule.field_name + "?")) return;
    let self = this;
    this.rpcService.getResponse("del_discovery_rule", function (objs: DiscoveryRule[]) {
      // refresh
      self.getDiscoveryRules();
    }, discovery_rule.id);
  }

}
