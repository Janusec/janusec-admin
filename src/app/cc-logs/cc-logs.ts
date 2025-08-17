import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { SimpleCCLog, CCLogsCount, PolicyAction, CCLog } from '../models/security';
import { Router } from '@angular/router';
import { RPCService } from '../services/rpc.service';
import { MessageService } from '../services/message.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-cc-logs',
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatInputModule
  ],
  templateUrl: './cc-logs.html',
  styleUrl: './cc-logs.css'
})
export class CCLogs {

  app_id: string = '0';
  start_date: Date = new Date();
  end_date: Date = new Date();
  request_count: number = 20;
  pageIndex: number = 0;

  //dataSource: LogsDataSource;
  displayedColumns = ['request_time', 'client_ip', 'method', 'host', 'url_path', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new LogsDataSource(this.paginator);

  constructor(public rpcService: RPCService,
    public dialog: MatDialog,
    private router: Router,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService) { }

  ngOnInit() {
    this.app_id = '0';
    if (this.rpcService.authUser$().logged == false) {
      this.router.navigate(['/']);
      return
    }
    if (this.rpcService.authUser$().need_modify_pwd) {
      this.router.navigate(['/appuser/' + this.rpcService.authUser$().user_id]);
      return
    }
    if (this.rpcService.applications$().length == 0) {
      this.rpcService.getApplications(() => { });
    }
    this.start_date = new Date();
    this.start_date.setHours(0, 0, 0, 0);
    this.end_date = new Date();
    this.end_date.setHours(23, 59, 59, 0);

    // Load last logs
    if (this.rpcService.lastCCLogs.length > 0) {
      this.dataSource.loadLast();
      this.app_id = this.rpcService.lastCCLogs.app_id;
      this.start_date = this.rpcService.lastCCLogs.start_date;
      this.end_date = this.rpcService.lastCCLogs.end_date;
      this.pageIndex = this.rpcService.lastCCLogs.page_index;
    }

  }

  getCCLogsCount(app_id: string, start_time: number, end_time: number) {
    let body = { action: "get_cc_logs_count", app_id: app_id, start_time: start_time, end_time: end_time }
    var self = this;
    this.paginator.pageIndex = 0;
    this.rpcService.getResponseByCustomBody(body, function (obj: CCLogsCount) {
      if (obj != null) {
        self.paginator.length = obj.count;
        self.dataSource.loadLogs(self.app_id, start_time, end_time, 0, self.request_count);
        self.rpcService.lastCCLogs.length = obj.count;
        self.cdr.detectChanges();
      }
    });
  }

  queryCCLogs() {
    let start_time = this.start_date.getTime() / 1000;
    let end_time = this.end_date.getTime() / 1000 + 1;
    this.getCCLogsCount(this.app_id, start_time, end_time);
  }

  pageChanged() {
    let start_time = this.start_date.getTime() / 1000;
    let end_time = this.end_date.getTime() / 1000 + 1;
    this.dataSource.loadLogs(this.app_id, start_time, end_time, this.paginator.pageIndex, this.request_count);
  }

  getDate(unix: number): string {
    return this.rpcService.getDateString(unix);
  }

  getPolicyActionEnumString(value: number) {
    return PolicyAction[value];
  }

  openCCLogDialog(ccLog: CCLog) {
    this.dialog.open(CCLogDialog, {
      width: '900px',
      maxWidth: '1000px',
      data: { "ccLog": ccLog }
    });
  }
}


import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { WAFLogDialog } from '../waf-logs/waf-log-dialog/waf-log-dialog';
import { CCLogDialog } from './cc-log-dialog/cc-log-dialog';
export class LogsDataSource extends DataSource<SimpleCCLog> {

  private logsSubject = new BehaviorSubject<SimpleCCLog[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  rpcService = inject(RPCService)
  constructor(private paginator: MatPaginator) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<SimpleCCLog[]> {
    return this.logsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.logsSubject.complete();
    this.loadingSubject.complete();
  }

  loadLogs(app_id: string, start_time: number, end_time: number, pageIndex = 0, pageSize: number) {
    this.loadingSubject.next(true);
    let body = { action: "get_cc_logs", app_id: app_id, start_time: start_time, end_time: end_time, request_count: pageSize, offset: pageIndex * pageSize }
    var self = this;
    this.rpcService.getResponseByCustomBody(body, function (logs: SimpleCCLog[]) {
      if (logs != null) {
        self.logsSubject.next(logs)
        self.rpcService.lastCCLogs.app_id = app_id;
        self.rpcService.lastCCLogs.start_date = new Date(start_time * 1000);
        self.rpcService.lastCCLogs.end_date = new Date((end_time - 1) * 1000);
        self.rpcService.lastCCLogs.page_index = pageIndex;
        self.rpcService.lastCCLogs.cc_logs = logs;
      }
    });
  }

  loadLast() {
    this.logsSubject.next(this.rpcService.lastCCLogs.cc_logs);
  }

}
