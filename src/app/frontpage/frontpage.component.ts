import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { ApplicationService } from '../application.service';
import { MessageService } from '../message.service';
import { AuthUser } from '../models';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent implements OnInit {

  constructor(public applicationService: ApplicationService,
    private messageService: MessageService,
    private router: Router) { }

  ngOnInit() {
    let self =this;
    this.applicationService.getAuthUser(function(auth_user: AuthUser){
      if(!auth_user.logged) {
        self.router.navigate(['/login']);
        return
      } else {
        if(auth_user.need_modify_pwd) {
          self.messageService.add("Please modify your password before next step!")
          self.router.navigate(['/appuser/'+auth_user.user_id]);
        return
        }
      }
    });    
  }

}
