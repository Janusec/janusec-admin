import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../application.service'; 
import { MessageService } from '../message.service';
import { RefererURL } from '../models';

@Component({
  selector: 'app-referer',
  templateUrl: './referer.component.html',
  styleUrls: ['./referer.component.css']
})
export class RefererComponent implements OnInit {
  app_id: number;
  host: string;
  referer_urls : RefererURL[];

  constructor(private route: ActivatedRoute,
    public applicationService: ApplicationService,
    private router: Router,
    private messageService: MessageService) {         
  }


  ngOnInit(): void {
    let app_id = this.route.snapshot.paramMap.get('app_id');
    this.host = this.route.snapshot.paramMap.get('host');
    this.app_id = Number(app_id);
    this.getRefererURLs(this.app_id, this.host);   
  }

  getRefererURLs(app_id: number, host: string) {
    let body={action:"get_referer_urls", app_id: app_id, host: host}
    let self = this;
    this.applicationService.getResponseByCustomBody(body, function(referer_urls: RefererURL[]){
        self.referer_urls = referer_urls;
    });
  }

  getAppNameByID(app_id:number) {
    if(app_id==0) return 'All';
    return this.applicationService.appmap[app_id];
  }

}
