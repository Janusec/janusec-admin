import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RPCService } from '../services/rpc.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { AuthUser } from '../models/auth';
import { WritableSignal } from '@angular/core';
import { MessageService } from '../services/message.service';

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
    private router: Router) {
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  ngOnInit() {
    var lang = localStorage.getItem('lang');
    if (lang == null && navigator.language.indexOf('zh') > -1) {
      localStorage.setItem('lang', 'zh-cn');
      window.location.reload();
    }
  }

  switchLanguage() {
    var lang = localStorage.getItem('lang');
    if (lang == null || lang == "" || lang == "en") {
      localStorage.setItem('lang', 'zh-cn');
    } else {
      localStorage.setItem('lang', 'en');
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

  test() {
    this.msgService.addSuccessMessage('Test msg!');
    this.msgService.addWarnMessage('Warning!');
  }
}
