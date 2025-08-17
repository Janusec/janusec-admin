import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { RPCService } from '../services/rpc.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-authcode-register',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    QRCodeComponent
  ],
  templateUrl: './authcode-register.html',
  styleUrl: './authcode-register.css'
})
export class AuthcodeRegister {
  qrData: string = '';
  code: string = '';

  constructor(
    public rpcService: RPCService,
    public cdr: ChangeDetectorRef,
    private msgService: MessageService,
    private router: Router) { }

  ngOnInit(): void {
    let authUser = this.rpcService.authUser$();
    this.qrData = "otpauth://totp/" + authUser.username + "?secret=" + authUser.totp_key + "&issuer=JANUSEC";
    console.log(this.qrData);
    this.cdr.detectChanges();
  }

  verify() {
    let body = { action: "verify_totp", uid: this.rpcService.authUser$().username, code: this.code }
    var self = this;
    this.rpcService.getResponseByCustomBody(body, function () {
      self.msgService.addSuccessMessage('verify ok, please login with new auth code');
      self.router.navigate(['/login']);
    })
  }

}
