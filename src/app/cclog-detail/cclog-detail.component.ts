import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApplicationService } from '../application.service'; 
import { MessageService } from '../message.service';
import { CCLog,PolicyAction } from '../models';

@Component({
  selector: 'app-cclog-detail',
  templateUrl: './cclog-detail.component.html',
  styleUrls: ['./cclog-detail.component.css']
})
export class CCLogDetailComponent implements OnInit {

  @Input()  log: CCLog;


  constructor(private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private router: Router,
    private messageService: MessageService,
    private location: Location) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    var self = this;
    this.applicationService.getResponse('getcclog', function(obj: CCLog){
      self.log = obj;
    },id);
  }

  getDate(unix: number): string {
    return new Date(unix*1000).toLocaleString('zh-CN', {hour12: false});
  }

  goBack() {
    this.location.back();
  }

  getPolicyActionEnumString(value: number) {
    return PolicyAction[value];
  }


}
