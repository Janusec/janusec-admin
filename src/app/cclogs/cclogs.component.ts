import { Component, OnInit, ViewChild } from '@angular/core';
import { Application,SimpleCCLog,CCLogsCount,PolicyAction } from '../models';
import { Router } from '@angular/router';
import { ApplicationService } from '../application.service';
import { MessageService } from '../message.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-cclogs',
  templateUrl: './cclogs.component.html',
  styleUrls: ['./cclogs.component.css']
})
export class CCLogsComponent implements OnInit {

  app_id : number;  
  start_date: Date;
  end_date: Date;
  request_count: number = 20;
  

  ccLogDataSource: LogsDataSource;
  displayedColumns = ['id', 'request_time', 'client_ip', 'method', 'host', 'url_path', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public applicationService: ApplicationService,
    private router: Router,
    private messageService: MessageService) { }

  ngOnInit() {
    if (this.applicationService.auth_user.logged==false) {
      this.router.navigate(['/']);
      return
    } 
    if (this.applicationService.auth_user.need_modify_pwd) {
      this.router.navigate(['/appuser/'+this.applicationService.auth_user.user_id]);
      return
    } 
    if(this.applicationService.applications.length==0) {
      var self = this;
      this.applicationService.getResponse('get_apps', function(obj: Application[]){   
      if(obj != null) {
            self.applicationService.applications = obj;
            self.app_id = self.applicationService.applications[0].id;
        }             
    });
    } else {
      this.app_id = this.applicationService.applications[0].id;
    }
    this.start_date = new Date();
    this.start_date.setHours(0,0,0,0);
    this.end_date = new Date();
    this.end_date.setHours(23,59,59,0);
    this.ccLogDataSource = new LogsDataSource(this.applicationService);
    // Load last logs
    if(this.applicationService.lastCCLogs.length>0) {
      this.ccLogDataSource.loadLast();
      this.app_id=this.applicationService.lastCCLogs.app_id;
      this.start_date=this.applicationService.lastCCLogs.start_date;
      this.end_date=this.applicationService.lastCCLogs.end_date;
      this.paginator.length=this.applicationService.lastCCLogs.length;
      this.paginator.pageIndex=this.applicationService.lastCCLogs.page_index;
    }
    
  }

  getCCLogsCount(app_id: number, start_time:number, end_time:number) {
    let body={action:"get_cc_logs_count", app_id: app_id, start_time: start_time, end_time: end_time}
    var self = this;
    this.paginator.pageIndex=0;
    this.applicationService.getResponseByCustomBody(body, function(obj: CCLogsCount){
        if(obj != null) {
            self.paginator.length=obj.count;
            self.ccLogDataSource.loadLogs(self.app_id, start_time, end_time, 0, self.request_count);
            self.applicationService.lastCCLogs.length=obj.count;
        }
    });
  }

  queryCCLogs() {
    let start_time = this.start_date.getTime()/1000;
    let end_time = this.end_date.getTime()/1000 + 1;    
    this.getCCLogsCount(this.app_id, start_time, end_time);
  }

  pageChanged() {
    let start_time = this.start_date.getTime()/1000;
    let end_time = this.end_date.getTime()/1000 + 1;    
    this.ccLogDataSource.loadLogs(this.app_id, start_time, end_time, this.paginator.pageIndex, this.request_count);
  }

  getDate(unix: number): string {
    return new Date(unix*1000).toLocaleString('zh-CN', {hour12: false});
  }

  getPolicyActionEnumString(value: number) {
    return PolicyAction[value];
  }

}


import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
export class LogsDataSource implements DataSource<SimpleCCLog> {

  private logsSubject = new BehaviorSubject<SimpleCCLog[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private applicationService: ApplicationService) {}

  connect(collectionViewer: CollectionViewer): Observable<SimpleCCLog[]> {
      return this.logsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.logsSubject.complete();
      this.loadingSubject.complete();
  }

  loadLogs(app_id: number, start_time: number, end_time: number, pageIndex = 0, pageSize) {
      this.loadingSubject.next(true);
      let body={action:"get_cc_logs", app_id: app_id, start_time: start_time, end_time: end_time, request_count:pageSize, offset:pageIndex*pageSize}
      var self = this;
      this.applicationService.getResponseByCustomBody(body, function(logs: SimpleCCLog[]){
        if(logs != null) {
            self.logsSubject.next(logs)
            self.applicationService.lastCCLogs.app_id=app_id;
            self.applicationService.lastCCLogs.start_date = new Date(start_time*1000);
            self.applicationService.lastCCLogs.end_date = new Date((end_time-1)*1000);
            self.applicationService.lastCCLogs.page_index = pageIndex;
            self.applicationService.lastCCLogs.cc_logs = logs;
        }
    });
  }

  loadLast() {
    this.logsSubject.next(this.applicationService.lastCCLogs.cc_logs);
  }

}
