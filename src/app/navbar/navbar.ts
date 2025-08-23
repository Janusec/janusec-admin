import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RPCService } from '../services/rpc.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { AppUser } from '../models/auth';
import { MessageService } from '../services/message.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDialog } from '../usermgmt/user-dialog/user-dialog';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbar,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatDivider,
    RouterModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  logoPath: string = 'assets/images/logo.png';
  personIcon: string = 'assets/images/person_1x.png';
  rpcService = inject(RPCService);
  private msgService = inject(MessageService);

  constructor(
    public dialog: MatDialog,
    private router: Router) {
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  ngOnInit() {
    var lang = localStorage.getItem('lang');
    if (lang == null && navigator.language.indexOf('zh') > -1) {
      localStorage.setItem('lang', 'zh-CN');
      window.location.reload();
    }
  }

  openAppUserDialog(appUser: AppUser | null) {
    this.dialog.open(UserDialog, {
      width: '600px',
      maxWidth: '800px',
      data: { "appUser": appUser }
    }).afterClosed().subscribe(() => {
      //
    });
  }

  switchLanguage() {
    var lang = localStorage.getItem('lang');
    if (lang == null || lang == '' || lang == 'en-US') {
      localStorage.setItem('lang', 'zh-CN');
    } else {
      localStorage.setItem('lang', 'en-US');
    }
    window.location.reload();
  }

  logout() {
    const body = { action: 'logout' };
    let self = this;
    this.rpcService.getResponse('logout', function () {
      self.rpcService.logout();
      self.router.navigate(['/login']);
    });
  }

}
