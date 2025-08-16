import { Component, inject, ViewChild } from '@angular/core';
import { Application } from '../models/application';
import { SimpleRegexHitLog, RegexHitLogsCount, PolicyAction } from '../models/security';
import { Router } from '@angular/router';
import { RPCService } from '../services/rpc.service';
import { MessageService } from '../services/message.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-waf-logs',
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
  templateUrl: './waf-logs.html',
  styleUrl: './waf-logs.css'
})
export class WAFLogs {

  app_id: string = '0';
  start_date: Date = new Date();
  end_date: Date = new Date();
  request_count: number = 20;
  pageIndex: number = 0;


  displayedColumns = ['request_time', 'client_ip', 'method', 'host', 'url_path', 'action', 'policy_id'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new LogsDataSource(this.paginator);

  constructor(public rpcService: RPCService,
    private router: Router,
    private msgService: MessageService) { }

  ngOnInit() {
    if (this.rpcService.authUser$().logged == false) {
      this.router.navigate(['/']);
      return
    }
    if (this.rpcService.authUser$().need_modify_pwd) {
      this.msgService.addWarnMessage('Please modify your password!');
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
    if (this.rpcService.lastRegexLogs.length > 0) {
      this.dataSource.loadLast();
      this.app_id = this.rpcService.lastRegexLogs.app_id;
      this.start_date = this.rpcService.lastRegexLogs.start_date;
      this.end_date = this.rpcService.lastRegexLogs.end_date;
      this.pageIndex = this.rpcService.lastRegexLogs.page_index;
    }

  }

  getRegexLogsCount(app_id: string, start_time: number, end_time: number) {
    let body = { action: "get_regex_logs_count", app_id: app_id, start_time: start_time, end_time: end_time }
    var self = this;
    this.paginator.pageIndex = 0;
    this.rpcService.getResponseByCustomBody(body, function (obj: RegexHitLogsCount) {
      if (obj != null) {
        self.paginator.length = obj.count;
        self.dataSource.loadLogs(self.app_id, start_time, end_time, 0, self.request_count);
        self.rpcService.lastRegexLogs.length = obj.count;
      }
    });
  }

  queryRegexLogs() {
    let start_time = this.start_date.getTime() / 1000;
    let end_time = this.end_date.getTime() / 1000 + 1;
    this.getRegexLogsCount(this.app_id, start_time, end_time);
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

}

import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
export class LogsDataSource extends DataSource<SimpleRegexHitLog> {

  private logsSubject = new BehaviorSubject<SimpleRegexHitLog[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  rpcService = inject(RPCService)

  constructor(private paginator: MatPaginator) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<SimpleRegexHitLog[]> {
    return this.logsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.logsSubject.complete();
    this.loadingSubject.complete();
  }

  loadLogs(app_id: string, start_time: number, end_time: number, pageIndex = 0, pageSize: number) {
    this.loadingSubject.next(true);
    let body = { action: "get_regex_logs", app_id: app_id, start_time: start_time, end_time: end_time, request_count: pageSize, offset: pageIndex * pageSize }
    var self = this;
    this.rpcService.getResponseByCustomBody(body, function (logs: SimpleRegexHitLog[]) {
      if (logs != null) {
        self.logsSubject.next(logs)
        self.rpcService.lastRegexLogs.app_id = app_id;
        self.rpcService.lastRegexLogs.start_date = new Date(start_time * 1000);
        self.rpcService.lastRegexLogs.end_date = new Date((end_time - 1) * 1000);
        self.rpcService.lastRegexLogs.page_index = pageIndex;
        self.rpcService.lastRegexLogs.regex_logs = logs;
      }
    });
  }

  loadLast() {
    this.logsSubject.next(this.rpcService.lastRegexLogs.regex_logs);
  }

}
