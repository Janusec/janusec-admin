import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { ApplicationService } from '../application.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authcode-register',
  templateUrl: './authcode-register.component.html',
  styleUrls: ['./authcode-register.component.css']
})
export class AuthcodeRegisterComponent implements OnInit {
  qrData: string;
  code: string;

  constructor(
      public applicationService: ApplicationService,
      private messageService: MessageService,
      private router: Router) { }

  ngOnInit(): void {
      this.qrData = "otpauth://totp/" + this.applicationService.auth_user.username + "?secret=" + this.applicationService.auth_user.totp_key + "&issuer=JANUSEC";
  }

  verify() {
    let body={action:"verify_totp", uid: this.applicationService.auth_user.username, code: this.code}
    var self = this;
      this.applicationService.getResponseByCustomBody(body, function() {
        self.messageService.add('verify ok, please login');
        self.router.navigate(['/login']);        
      })
  }

}
