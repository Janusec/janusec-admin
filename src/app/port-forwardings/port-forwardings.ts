import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RPCService } from '../services/rpc.service';
import { VipApp } from '../models/application';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PortForwardingDialog } from './port-forwarding-dialog/port-forwarding-dialog';
import { MessageService } from '../services/message.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-port-forwardings',
  imports: [
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatDividerModule
  ],
  templateUrl: './port-forwardings.html',
  styleUrl: './port-forwardings.css'
})
export class PortForwardings {

  dataSource = new MatTableDataSource<VipApp>();
  displayedColumns = ['name', 'is_tcp', 'listen_port', 'description', 'action'];
  keyword: string = '';

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(public rpcService: RPCService,
    public msgService: MessageService,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    if (this.rpcService.auth_user$().logged == false) {
      this.router.navigate(['/']);
      return
    }
    let self = this;
    this.rpcService.getVipApps(() => {
      self.dataSource.data = self.rpcService.vipApps$();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  delVipApp(vipApp: VipApp) {
    if (!confirm("Are you sure to delete port forwarding: " + vipApp.name + "?")) return;
    var self = this;
    this.rpcService.getResponse('del_vip_app', function () {
      self.rpcService.removeLocalVipApp(vipApp.id);
      self.dataSource.data = self.rpcService.vipApps$();
      self.msgService.addWarnMessage(vipApp.name + " deleted.");
    }, vipApp.id);
  }

  openVipAppDialog(vipApp: VipApp | null) {
    this.dialog.open(PortForwardingDialog, {
      width: '650px',
      maxWidth: '100%',
      disableClose: true,
      data: { "vipApp": vipApp ? { ...vipApp } : null }
    }).afterClosed().subscribe(() => {
      this.dataSource.data = this.rpcService.vipApps$();
    });
  }


}
