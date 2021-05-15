import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';
import * as cryptojs from 'crypto-js';
import { AuthUser, OAuthInfo } from '../models';
import { MessageService } from '../message.service';
import { ApplicationService } from '../application.service';
declare var require: any;

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  //username: string;
  password: string;
  submitted = false; 
  oauth: OAuthInfo = new (OAuthInfo);
  login_user:AuthUser = {
    user_id:0, 
    username: '', 
    passwd: '', 
    logged: false, 
    is_super_admin: false,
    is_cert_admin: false,
    is_app_admin: false,
    need_modify_pwd:false,
    totp_key: '',
    totp_verified: false
};
  
  onSubmit(event) { 
    if(!this.login_user.username || !this.password){
      this.messageService.add("Please input your username and password!");
      this.submitted = false; 
      return;
    }
    this.messageService.clear();
    let salt = '$2a$12$' + String(cryptojs.SHA256('Janusec'+this.login_user.username+this.password)).substring(0,22);
    let hashpwd = bcrypt.hashSync(this.password, salt);
    this.login_user.passwd = hashpwd;
    var self=this;
    this.applicationService.getResponse('login', function(obj: AuthUser){
        if(obj != null) {
            self.applicationService.auth_user=obj;      
            self.submitted = true; 
            if(self.oauth.authenticator_enabled && !self.applicationService.auth_user.logged) {
                self.router.navigate(['/authcode-register']);
            } else {
                self.router.navigate(['/']);
            }            
        }
    }, null, this.login_user); 
  }

  constructor(
    public applicationService: ApplicationService,
    private messageService: MessageService, 
    private http: HttpClient,
    private router: Router) { }

  ngOnInit() { 
    let self=this;   
    this.messageService.clear();
    this.applicationService.getResponseByURL('/janusec-admin/oauth/info',
      function(obj: OAuthInfo){
        if(obj != null) self.oauth=obj;
      });
  }
}
