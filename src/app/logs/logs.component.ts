import { Component, OnInit, ViewChild } from '@angular/core';
import { Application, SimpleRegexHitLog, RegexHitLogsCount, PolicyAction } from '../models';
import { Router } from '@angular/router';
import { RPCService } from '../rpc.service';
import { MessageService } from '../message.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  app_id: string;
  start_date: Date;
  end_date: Date;
  request_count: number = 20;
  pageLength: number;
  pageIndex: number;

  regexLogDataSource: LogsDataSource;
  displayedColumns = ['id', 'request_time', 'client_ip', 'method', 'host', 'url_path', 'action', 'policy_id'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public rpcService: RPCService,
    private router: Router,
    private messageService: MessageService) { }

  ngOnInit() {
    this.app_id = '0';
    if (this.rpcService.auth_user.logged == false) {
      this.router.navigate(['/']);
      return
    }
    if (this.rpcService.auth_user.need_modify_pwd) {
      this.router.navigate(['/appuser/' + this.rpcService.auth_user.user_id]);
      return
    }
    if (this.rpcService.applications.length == 0) {
      var self = this;
      this.rpcService.getResponse('get_apps', function (objs: Application[]) {
        if (objs != null) {
          self.rpcService.applications = objs;
          //if (objs.length > 0) self.app_id = self.rpcService.applications[0].id;
        }
      });
    }
    this.start_date = new Date();
    this.start_date.setHours(0, 0, 0, 0);
    this.end_date = new Date();
    this.end_date.setHours(23, 59, 59, 0);
    this.regexLogDataSource = new LogsDataSource(this.rpcService);
    // Load last logs
    if (this.rpcService.lastRegexLogs.length > 0) {
      this.regexLogDataSource.loadLast();
      this.app_id = this.rpcService.lastRegexLogs.app_id;
      this.start_date = this.rpcService.lastRegexLogs.start_date;
      this.end_date = this.rpcService.lastRegexLogs.end_date;
      this.pageLength = this.rpcService.lastRegexLogs.length;
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
        self.regexLogDataSource.loadLogs(self.app_id, start_time, end_time, 0, self.request_count);
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
    this.regexLogDataSource.loadLogs(this.app_id, start_time, end_time, this.paginator.pageIndex, this.request_count);
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
export class LogsDataSource implements DataSource<SimpleRegexHitLog> {

  private logsSubject = new BehaviorSubject<SimpleRegexHitLog[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private rpcService: RPCService) { }

  connect(collectionViewer: CollectionViewer): Observable<SimpleRegexHitLog[]> {
    return this.logsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.logsSubject.complete();
    this.loadingSubject.complete();
  }

  loadLogs(app_id: string, start_time: number, end_time: number, pageIndex = 0, pageSize) {
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
