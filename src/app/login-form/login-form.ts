import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RPCService } from '../services/rpc.service';
import { MessageService } from '../services/message.service';
import { OAuthInfo, AuthUser } from '../models/auth';
import * as bcrypt from 'bcryptjs';
import * as cryptojs from 'crypto-js';
import { FlexLayoutModule } from '@angular/flex-layout';


@Component({
  selector: 'app-login-form',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginForm {
  password: string = '';
  submitted = false;
  private oauth = signal<OAuthInfo>({
    use_oauth: false,
    display_name: '',
    entrance_url: '',
    authenticator_enabled: false
  });
  oauth$ = this.oauth.asReadonly();
  login_user: AuthUser = {
    user_id: '0',
    username: '',
    passwd: '',
    logged: false,
    is_super_admin: false,
    is_cert_admin: false,
    is_app_admin: false,
    need_modify_pwd: false,
    totp_key: '',
    totp_verified: false
  };

  onSubmit() {
    if (!this.login_user.username || !this.password) {
      this.msgService.addWarnMessage("Please input your username and password!");
      this.submitted = false;
      return;
    }
    this.msgService.clear();
    let salt = '$2a$12$' + String(cryptojs.SHA256('Janusec' + this.login_user.username + this.password)).substring(0, 22);
    let hashpwd = bcrypt.hashSync(this.password, salt);
    this.login_user.passwd = hashpwd;
    var self = this;
    this.rpcService.getResponse('login', function (obj: AuthUser) {
      if (obj != null) {
        self.submitted = true;
        if (self.oauth$().authenticator_enabled && !self.rpcService.auth_user$().logged) {
          self.router.navigate(['/authcode-register']);
        } else {
          self.router.navigate(['/']);
        }
      }
    }, null, this.login_user);
  }

  constructor(
    public rpcService: RPCService,
    private msgService: MessageService,
    private http: HttpClient,
    private router: Router) { }

  ngOnInit() {
    let self = this;
    this.msgService.clear();
    this.rpcService.getResponseByURL('/janusec-admin/oauth/info',
      function (obj: OAuthInfo) {
        if (obj != null) {
          self.oauth.set(obj);
        }
      });
  }
}
