import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RPCService } from '../services/rpc.service';
import { MessageService } from '../services/message.service';
import { AuthUser } from '../models/auth';
import { License } from '../models/gateway';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatList, MatListItem, MatNavList } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-frontpage',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatList,
    MatListItem,
    MatIcon,
    MatNavList
  ],
  templateUrl: './frontpage.html',
  styleUrl: './frontpage.css'
})
export class Frontpage {
  constructor(public rpcService: RPCService,
    private msgService: MessageService,
    private router: Router) { }

  ngOnInit() {
    let self = this;
    this.rpcService.getAuthUser(function (authUser: AuthUser) {
      if (!authUser.logged) {
        self.router.navigate(['/login']);
        return
      } else {
        // logged
        if (authUser.need_modify_pwd) {
          self.msgService.addWarnMessage("Please modify your password before next step!")
          self.router.navigate(['/appuser/' + authUser.user_id]);
          return
        }
      }
      // logged and modifing password is not required
    });
  }

  getDate(unix: number): string {
    return this.rpcService.getDateString(unix);
  }
}
