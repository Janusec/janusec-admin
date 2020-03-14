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
  username: string;
  password: string;
  submitted = false; 
  oauth: OAuthInfo = new (OAuthInfo);
  
  onSubmit(event) { 
    if(!this.username || !this.password){
      this.messageService.add("Please input your username and password!");
      this.submitted = false; 
      return;
    }
    this.messageService.clear();
    let salt = '$2a$12$' + String(cryptojs.SHA256('Janusec'+this.username+this.password)).substring(0,22);
    let hashpwd = bcrypt.hashSync(this.password, salt);
    const login_user:AuthUser = {user_id:0, username: this.username, passwd: hashpwd, logged: false, need_modify_pwd:false};
    var self=this;
    this.applicationService.getResponse('login', function(obj: AuthUser){
      self.applicationService.auth_user=obj;      
      self.submitted = true; 
      self.router.navigate(['/']);
    }, null, login_user); 
  }

  constructor(
    public applicationService: ApplicationService,
    private messageService: MessageService, 
    private http: HttpClient,
    private router: Router) { }

  ngOnInit() { 
    let self=this;   
    this.applicationService.getResponseByURL('/janusec-admin/oauth/get',
      function(obj: OAuthInfo){
        self.oauth=obj;
        console.log(self.oauth);
      })
  }
  

}
