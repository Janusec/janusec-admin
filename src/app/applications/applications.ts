import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RPCService } from '../services/rpc.service';
import { Application } from '../models/application';
import { MessageService } from '../services/message.service';
import { ApplicationDialog } from './application-dialog/application-dialog';

@Component({
  selector: 'app-applications',
  imports: [
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    MatIcon,
    MatDialogModule,
    MatTooltipModule],
  templateUrl: './applications.html',
  styleUrl: './applications.css'
})
export class Applications {

  //selectedApplication: Application;
  dataSource = new MatTableDataSource<Application>();
  displayedColumns = ['name', 'description', 'waf_enabled', 'action'];
  keyword: string = '';

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    public rpcService: RPCService,
    public msgService: MessageService,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    if (!this.rpcService.auth_user$().logged) {
      this.router.navigate(['/']);
      return
    }
    if (this.rpcService.auth_user$().need_modify_pwd) {
      this.router.navigate(['/appuser/' + this.rpcService.auth_user$().user_id]);
    }
    let self = this;
    this.rpcService.getApplications(() => {
      self.dataSource.data = self.rpcService.applications$();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  delApplication(app: Application) {
    if (!confirm("Are you sure to delete application: " + app.name + "?")) return;
    var self = this;
    this.rpcService.getResponse('del_app', function () {
      self.rpcService.removeLocalApplication(app.id);
      self.dataSource.data = self.rpcService.applications$();
      self.msgService.addWarnMessage(app.name + " deleted.");
    }, app.id);
  }


  openApplicationDialog(app: Application | null) {
    this.dialog.open(ApplicationDialog, {
      width: '95%',
      maxWidth: '100%',
      disableClose: true,
      data: { "application": app }
    }).afterClosed().subscribe(result => {
      this.dataSource.data = this.rpcService.applications$();
    });
  }


}