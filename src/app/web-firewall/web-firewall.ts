import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';
import { Application } from '../models/application';
import { GroupPolicy, PolicyAction, IPPolicy, CCPolicy } from '../models/security';
import { RPCService } from '../services/rpc.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';
import * as cryptojs from 'crypto-js';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { GroupPolicyDialog } from './group-policy-dialog/group-policy-dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-web-firewall',
  imports: [
    MatTableModule,
    MatIcon,
    MatPaginatorModule,
    MatInputModule
  ],
  templateUrl: './web-firewall.html',
  styleUrl: './web-firewall.css'
})
export class WebFirewall {
  dataSource = new MatTableDataSource<GroupPolicy>();
  displayedColumns = ['description', 'is_enabled', 'action'];
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(public messageService: MessageService,
    public rpcService: RPCService,
    public msgService: MessageService,
    public dialog: MatDialog,
    private router: Router) {

  }

  ngOnInit() {
    if (this.rpcService.authUser$().logged == false) {
      this.router.navigate(['/']);
      return
    }
    if (this.rpcService.authUser$().need_modify_pwd) {
      this.router.navigate(['/appuser/' + this.rpcService.authUser$().user_id]);
      return
    }
    let self = this;
    this.rpcService.getGroupPolicies(() => {
      self.dataSource.data = self.rpcService.groupPolicies$();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  delGroupPolicy(groupPolicy: GroupPolicy) {
    if (!confirm("Are you sure to delete group policy: " + groupPolicy.description + "?")) return;
    var self = this;
    this.rpcService.getResponse('del_group_policy', function () {
      self.rpcService.removeLocalGroupPolicy(groupPolicy.id);
      self.dataSource.data = self.rpcService.groupPolicies$();
      self.msgService.addWarnMessage(groupPolicy.description + " deleted.");
    }, groupPolicy.id);
  }

  openGroupPolicyDialog(groupPolicy: GroupPolicy | null) {
    this.dialog.open(GroupPolicyDialog, {
      width: '800px',
      maxWidth: '1000px',
      data: { "groupPolicy": groupPolicy ? { ...groupPolicy } : null }
    }).afterClosed().subscribe(result => {
      this.dataSource.data = this.rpcService.groupPolicies$();
    });
  }

  exportWAF() {
    of(this.rpcService.groupPolicies$()).subscribe(res => {
      let jsonStr = JSON.stringify(res);
      let blob = new Blob([jsonStr], { type: 'application/json' });
      let url = window.URL.createObjectURL(blob);

      let dynamicDownload = document.createElement('a');
      dynamicDownload.setAttribute('href', url);
      dynamicDownload.setAttribute('download', 'JANUSEC-WAF-Rules.json');

      document.body.appendChild(dynamicDownload);
      dynamicDownload.click();
      document.body.removeChild(dynamicDownload);

      window.URL.revokeObjectURL(url);
    });
  }

  @ViewChild('fileInput') fileInput!: ElementRef;
  importWAF() {
    this.fileInput.nativeElement.click();
  }

  readFile(event: any) {
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
      let self = this;
      this.rpcService.getGroupPolicies(() => {
        self.dataSource.data = self.rpcService.groupPolicies$();
      });
      this.messageService.addSuccessMessage("Import WAF policies finished!");
    }, 3000);
  }

  isInCurrentGroupPolicies(newGroupPolicy: GroupPolicy) {
    let unique_hash = this.rpcService.calcUniqueHash(newGroupPolicy);
    let groupPolicies = this.rpcService.groupPolicies$();
    for (let groupPolicy of groupPolicies) {
      if (unique_hash == groupPolicy.unique_hash) return true;
    }
    return false;
  }

  setGroupPolicy(group_policy: GroupPolicy) {
    var self = this;
    this.rpcService.getResponse('update_group_policy', function (obj: GroupPolicy) {
      if (obj != null) {
        self.rpcService.addOrUpdateLocalGroupPolicy(obj);
      }
    }, null, group_policy);
  }
}
