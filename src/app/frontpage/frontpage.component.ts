import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { ApplicationService } from '../application.service';
import { MessageService } from '../message.service';
import { AuthUser, License } from '../models';

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
        self.applicationService.getResponse('get_license', function(obj: License){
            self.applicationService.license = obj;
            if(obj != null && obj.edition=="Trial") {
                let expireTime = self.getDate(obj.expire_time);
                self.messageService.add("This is a trial edition, and will expire at " + expireTime + ". Limitation: max number of users: "+ obj.max_users_count + ", max number of applications: "+obj.max_apps_count+", max concurrency: "+obj.max_concurrency);
            }
        })
      }
    }); 
    setTimeout(() => 
    {
      if (this.applicationService.auth_user.logged==false) {
        this.router.navigate(['/login']);
      } 
    },500);
  }

  getDate(unix: number): string {
    return this.applicationService.getDateString(unix);
  }

}
