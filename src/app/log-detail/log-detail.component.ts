import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { RPCService } from '../rpc.service';
import { MessageService } from '../message.service';
import { RegexHitLog, PolicyAction } from '../models';

@Component({
  selector: 'app-log-detail',
  templateUrl: './log-detail.component.html',
  styleUrls: ['./log-detail.component.css']
})
export class LogDetailComponent implements OnInit {
  @Input() log: RegexHitLog;

  constructor(private route: ActivatedRoute,
    private rpcService: RPCService,
    private router: Router,
    private messageService: MessageService,
    private location: Location) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    var self = this;
    this.rpcService.getResponse('get_regex_log', function (obj: RegexHitLog) {
      if (obj != null) self.log = obj;
    }, id);
  }

  getDate(unix: number): string {
    return this.rpcService.getDateString(unix);
  }

  goBack() {
    this.location.back();
  }

  getPolicyActionEnumString(value: number) {
    return PolicyAction[value];
  }

}
