import { Component, OnInit, ElementRef, ViewChild, Inject  } from '@angular/core';
import { Router }            from '@angular/router';
import { ApplicationService } from '../application.service';
import { Chart } from 'chart.js';
import { VulnStat, PopContent, RefererHost } from '../models';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  todayVulnChart: Chart;
  weekCountChart: Chart;
  accessStatChart: Chart;
  // today chart
  today_stat_vuln_name: string[];
  today_stat_count: number[];
  today_stat_bgcolor: string[];
  // week chart
  week_stat_date: string[];
  week_stat_count: number[];
  selected_app_id: number = 0;
  selected_vuln_id: number =0;
  // access stat chart
  access_stat_date: string[];
  access_stat_count: number[];
  pop_contents: PopContent[];
  referer_hosts: RefererHost[];

 
  constructor(private elementRef: ElementRef,
    public applicationService: ApplicationService,
    private router: Router) { 
    }

  initTodayChart() {
    let htmlRef = this.elementRef.nativeElement.querySelector('#today_canvas');   
    if(this.todayVulnChart != null) this.todayVulnChart.destroy();
    this.todayVulnChart = new Chart(htmlRef, {
      type: 'doughnut',
      data: {
        labels: this.today_stat_vuln_name,
        datasets: [{
            data: this.today_stat_count,
            backgroundColor: this.today_stat_bgcolor,
            borderWidth: 1
        }]
    },
      options: {
        legend: {
          display: true,
          position: 'bottom'
        },
        title: {
          text: 'Today Attack Statistics',
          display: true
        },
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            display: false
          }],
        }
      }
    });
  }

  initWeekChart() {
    setTimeout(() => {
      let htmlRef = this.elementRef.nativeElement.querySelector('#week_canvas');
      if(this.weekCountChart != null) this.weekCountChart.destroy();
      this.weekCountChart = new Chart(htmlRef, {
        type: 'bar',
        data: {
          labels: this.week_stat_date,        
          datasets: [{
            label: 'Count',
            data: this.week_stat_count,
            backgroundColor: 'rgba(250,10,10,0.8)',
            borderWidth: 1
          }]
      },
        options: {
          legend: {
            display: true,
            position: 'bottom'
          },
          title: {
            text: 'Week Attack Statistics',
            display: true
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true,
              ticks: {
                beginAtZero: true
              }            
            }],
          }
        }
      });
    },300);    
  }

  initAccessStatChart() {
    setTimeout(() => {
      let htmlRef = this.elementRef.nativeElement.querySelector('#stat_canvas');
      if(this.accessStatChart != null) this.accessStatChart.destroy();
      this.accessStatChart = new Chart(htmlRef, {
        type: 'line',
        data: {
          labels: this.access_stat_date,        
          datasets: [{
            label: 'Count',
            lineTension: 0,  
            fill: false,
            data: this.access_stat_count,
            borderColor: 'rgba(00, 95, 200, 1.0)',
            /*backgroundColor: 'rgba(10,10,250,0.8)',*/
            borderWidth: 1
          }]
      },
        options: {
          legend: {
            display: true,
            position: 'bottom'
          },
          title: {
            text: 'Access Statistics',
            display: true
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true,
              ticks: {
                beginAtZero: true
              }            
            }],
          }
        }
      });
    },300);    
  }

  ngOnInit() {
    if (this.applicationService.auth_user.logged==false) {
      this.router.navigate(['/']);
      return
    } 
    if (this.applicationService.auth_user.need_modify_pwd) {
      this.router.navigate(['/appuser/'+this.applicationService.auth_user.user_id]);
    }    
    if(this.applicationService.vulntypes.length==0) {
      let self = this;
      this.applicationService.getVulnTypes(function(){
        self.getTodayVulnStat(0); 
        self.getWeekStat(0,0);
        self.getAccessStat(0);
        self.getPopContents(0);
        self.getRefererHosts(0);
      });
    } else {
      this.getTodayVulnStat(0);   
      this.getWeekStat(0,0);   
      this.getAccessStat(0);
      this.getPopContents(0);
      this.getRefererHosts(0);
    }
    if(this.applicationService.applications.length==0) {
      this.applicationService.getApplications();
    }
    this.initWeekChart();
    this.initAccessStatChart();
  }

  getVulnNameByID(vuln_id:number) {
    return this.applicationService.vulntypemap[vuln_id];
  }

  getAppNameByID(app_id:number) {
      return this.applicationService.appmap[app_id];
  }

  getTodayVulnStat(app_id: number) {
    let start_date = new Date();
    start_date.setHours(0,0,0,0);
    let end_date = new Date();
    end_date.setHours(23,59,59,0);
    let start_time = start_date.getTime()/1000;
    let end_time = end_date.getTime()/1000 + 1;  
    this.today_stat_vuln_name = [];
    this.today_stat_count = [];
    this.today_stat_bgcolor = [];
    let body={action:"get_vuln_stat", app_id: app_id, start_time: start_time, end_time: end_time}
      let self = this;
      this.applicationService.getResponseByCustomBody(body, function(vuln_stats: VulnStat[]){
        if(vuln_stats == null) {
          vuln_stats = [];
        }
        for (let vuln_stat of vuln_stats) {
          let vuln_name = self.getVulnNameByID(vuln_stat.vuln_id);
          self.today_stat_vuln_name.push(vuln_name);
          self.today_stat_count.push(vuln_stat.count);
          self.today_stat_bgcolor.push(self.getColorString(vuln_stat.vuln_id));
        }
        self.initTodayChart();
    });
  }

  getWeekStat(app_id: number, vuln_id: number) {
    let begin_date = new Date();
    begin_date.setHours(0,0,0,0);
    let start_time = begin_date.getTime() - 86400*1000*6;
    this.week_stat_date = [];
    for(let i=0;i<7;i++) {
      let tmp_date = new Date(start_time + 86400*1000*i);
      this.week_stat_date.push(tmp_date.toLocaleDateString());
    }
    let body={action:"get_week_stat", app_id: app_id, vuln_id: vuln_id, start_time: start_time/1000}
      let self = this;
      this.applicationService.getResponseByCustomBody(body, function(week_stats: number[]){
        if(week_stats == null) {
          week_stats = [0,0,0,0,0,0,0];
        }
        self.week_stat_count = week_stats;
        self.initWeekChart();
    });
  }

  getAccessStat(app_id: number) {
    let begin_date = new Date();
    begin_date.setHours(0,0,0,0);
    let start_time = begin_date.getTime() - 86400*1000*13;
    this.access_stat_date = [];
    for(let i=0;i<14;i++) {
      let tmp_date = new Date(start_time + 86400*1000*i);
      this.access_stat_date.push(tmp_date.toLocaleDateString());
    }
    let body={action:"get_access_stat", app_id: app_id}
    let self = this;
    this.applicationService.getResponseByCustomBody(body, function(access_stats: number[]){
        if(access_stats == null) {
            access_stats = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        }
        self.access_stat_count = access_stats;
        self.initAccessStatChart();
    });
  }

  getPopContents(app_id: number) {
    let body={action:"get_pop_contents", app_id: app_id}
    let self = this;
    this.applicationService.getResponseByCustomBody(body, function(pop_contents: PopContent[]){
        self.pop_contents = pop_contents;
    });
  }

  getRefererHosts(app_id: number) {
    let body={action:"get_referer_hosts", app_id: app_id}
    let self = this;
    this.applicationService.getResponseByCustomBody(body, function(referer_hosts: RefererHost[]){
        self.referer_hosts = referer_hosts;
    });
  }

  getColorString(value: number): string {
    let value_r = value*60;// + Math.floor(Math.random()*20);
    let value_g = value*50;// + Math.floor(Math.random()*20);
    let value_b = value*50;// + Math.floor(Math.random()*20);
    let color = 'rgba(' + value_r%256 + ',' + value_g%256 + ',' + value_b%256 + ',0.9)'
    //console.log(color);
    return color
  }

  statByAppID() {
    this.getTodayVulnStat(this.selected_app_id);
    this.statByAppAndVuln();
    this.getAccessStat(this.selected_app_id);
    this.getPopContents(this.selected_app_id);
    this.getRefererHosts(this.selected_app_id);
  }

  statByAppAndVuln() {
    this.getWeekStat(this.selected_app_id, this.selected_vuln_id);
  }

}
