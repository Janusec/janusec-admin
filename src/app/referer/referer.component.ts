import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../application.service'; 
import { MessageService } from '../message.service';

@Component({
  selector: 'app-referer',
  templateUrl: './referer.component.html',
  styleUrls: ['./referer.component.css']
})
export class RefererComponent implements OnInit {
  selected_app_id: number;
  host: string;

  constructor(private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private router: Router,
    private messageService: MessageService) { }

  ngOnInit(): void {
    let app_id = this.route.snapshot.paramMap.get('app_id');
    let host = this.route.snapshot.paramMap.get('host');
    console.log(app_id, host);
  }

}
