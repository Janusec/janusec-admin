import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AppUser, AuthUser } from '../../models/auth';
import { APIResponse } from '../../models/rpc';
import { RPCService } from '../../services/rpc.service';
import { MessageService } from '../../services/message.service';
import * as bcrypt from 'bcryptjs';
import * as cryptojs from 'crypto-js';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface IData {
  appUser: AppUser
}

@Component({
  selector: 'app-user-dialog',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatDialogClose,
    MatIcon,
    MatCheckboxModule
  ],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.css'
})
export class UserDialog {
  appUser: AppUser = {
    id: '0',
    username: '',
    password: '',
    email: '',
    is_super_admin: false,
    is_cert_admin: false,
    is_app_admin: false,
    need_modify_pwd: true
  };
  plainpwd: string = '';
  plainpwd2: string = '';
  readOnlyValue: boolean = true;
  readOnlyButtonText: string = "Edit";

  constructor(private route: ActivatedRoute,
    public rpcService: RPCService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<UserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IData) {
    if (data.appUser !== null) {
      this.appUser = data.appUser
    } else {
      this.readOnlyValue = false;
    }
  }

  changeEditable() {
    this.readOnlyValue = !this.readOnlyValue;
    if (this.readOnlyValue) {
      this.readOnlyButtonText = "Edit";
    } else {
      this.readOnlyButtonText = "Cancel";
    }
  }

  setAppUser() {
    if (this.plainpwd != this.plainpwd2) {
      this.messageService.addWarnMessage("Password mismatch");
      return;
    }
    if (this.plainpwd) {
      let salt = '$2a$12$' + String(cryptojs.SHA256('Janusec' + this.appUser.username + this.plainpwd)).substring(0, 22);
      let hashpwd = bcrypt.hashSync(this.plainpwd, salt);
      this.appUser.password = hashpwd;
    } else {
      this.appUser.password = "";
    }
    let self = this;
    this.rpcService.getResponse('update_app_user', function (appUser: AppUser) {
      if (appUser !== null) {
        self.rpcService.addOrUpdateLocalAppUser(appUser);
        if (appUser.id == self.rpcService.authUser$().user_id) {
          // current user
          let authUser: AuthUser = {
            user_id: appUser.id,
            username: appUser.username,
            passwd: '',
            logged: true,
            is_super_admin: appUser.is_super_admin,
            is_cert_admin: appUser.is_cert_admin,
            is_app_admin: appUser.is_app_admin,
            need_modify_pwd: appUser.need_modify_pwd,
            totp_key: self.rpcService.authUser$().totp_key,
            totp_verified: self.rpcService.authUser$().totp_verified
          }
          self.rpcService.setAuthUser(authUser);
        }
        self.messageService.addSuccessMessage(self.appUser.username + " saved.");
      }
      self.dialogRef.close();
    }, null, this.appUser);
  }
}
