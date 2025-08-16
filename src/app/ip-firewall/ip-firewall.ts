import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PolicyAction, IPPolicy } from '../models/security';
import { MessageService } from '../services/message.service';
import { RPCService } from '../services/rpc.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-ip-firewall',
  imports: [
    MatTableModule,
    FormsModule,
    MatSelectModule,
    MatIcon,
    MatPaginatorModule
  ],
  templateUrl: './ip-firewall.html',
  styleUrl: './ip-firewall.css'
})
export class IPFirewall {

  enum_action_values: { value: number; name: string }[] = [];//number[]=[];

  dataSource = new MatTableDataSource<IPPolicy>();
  displayedColumns = ['ip_addr', 'is_allow', 'apply_to_waf', 'apply_to_cc', 'create_time', 'description', 'editable'];
  @ViewChild('paginator') paginator!: MatPaginator;
  policyActionEntries: [string, string | PolicyAction][] = [];
  ipPolicies: IPPolicy[] = [];

  constructor(public msgService: MessageService,
    public rpcService: RPCService,
    private router: Router) {
    this.policyActionEntries = Object.entries(PolicyAction).filter(
      ([key, value]) => typeof value === 'number'
    );
    if (this.rpcService.authUser$().logged) {
      if (this.rpcService.applications$().length == 0) {
        this.rpcService.getApplications(() => { });
      }
      if (this.rpcService.vulnTypes$().length == 0) {
        this.rpcService.getVulnTypes(function () { });
      }
      // get IPPolicies
      var self = this;
      this.rpcService.getResponse('get_ip_policies', function (objs: IPPolicy[]) {
        self.ipPolicies = objs;
        self.dataSource.data = self.ipPolicies;
      });
    }
  }

  ngOnInit() {
    if (this.rpcService.authUser$().logged == false) {
      this.router.navigate(['/']);
      return
    }
    if (this.rpcService.authUser$().need_modify_pwd) {
      this.msgService.addWarnMessage('Please modify your password!');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  addIPPolicy() {
    let ip_policy: IPPolicy = {
      id: '0',
      ip_addr: "127.0.0.1",
      is_allow: true,
      apply_to_waf: true,
      apply_to_cc: true,
      create_time: Date.now() / 1000,
      description: '',
      editable: true,
    };
    this.ipPolicies.splice(0, 0, ip_policy);
    this.dataSource.data = this.ipPolicies;
    //
  }

  saveIP(index: number) {
    let self = this;
    let ip_policy = this.ipPolicies[index];
    this.rpcService.getResponse('update_ip_policy', function (obj: IPPolicy) {
      self.ipPolicies[index] = obj;
      self.ipPolicies[index].editable = false;
      self.dataSource.data = self.ipPolicies;
    }, '0', ip_policy);

  }

  deleteIP(index: number) {
    let self = this;
    let ip_policy = this.ipPolicies[index];
    if (ip_policy.id == '0') {
      self.ipPolicies.splice(index, 1);
      self.dataSource.data = self.ipPolicies;
    } else {
      this.rpcService.getResponse('del_ip_policy', function () {
        self.ipPolicies.splice(index, 1);
        self.dataSource.data = self.ipPolicies;
      }, ip_policy.id);
    }
  }

}
