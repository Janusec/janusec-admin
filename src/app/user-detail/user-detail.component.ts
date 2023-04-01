import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppAdmin, APIResponse } from '../models';
import { RPCService } from '../rpc.service';
import { MessageService } from '../message.service';
import * as bcrypt from 'bcryptjs';
import * as cryptojs from 'crypto-js';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  appadmin: AppAdmin;
  plainpwd: string;
  plainpwd2: string;
  readOnlyValue: boolean = true;
  readOnlyButtonText: string = "Edit";
  resp: APIResponse;

  constructor(private route: ActivatedRoute,
    private rpcService: RPCService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient) { }

  ngOnInit() {
    this.appadmin = new AppAdmin();
    this.getAdmin();
  }

  getAdmin(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id != '0') {
      let self = this;
      this.rpcService.getResponse('get_app_user', function (obj: AppAdmin) {
        if (obj != null) self.appadmin = obj;
        if (self.appadmin.need_modify_pwd) self.readOnlyValue = false;
      }, id, null);
    } else {
      this.appadmin = new AppAdmin();
      this.appadmin.id = '0';
      this.appadmin.is_super_admin = false;
      this.appadmin.is_cert_admin = false;
      this.appadmin.is_app_admin = false;
      this.appadmin.need_modify_pwd = true;
      this.readOnlyValue = false;
      this.readOnlyButtonText = "Cancel";
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

  onDelete() {
    if (!confirm("Are you sure to delete user: " + this.appadmin.username + "?")) return;
    let self = this;
    this.rpcService.getResponse('del_app_user', function () {
      self.messageService.add(self.appadmin.username + " deleted.");
      self.router.navigate(['/usermgmt']);
    }, this.appadmin.id, null);
  }

  onSave() {
    if (this.plainpwd != this.plainpwd2) {
      this.messageService.add("Password mismatch");
      return;
    }
    if (this.plainpwd) {
      let salt = '$2a$12$' + String(cryptojs.SHA256('Janusec' + this.appadmin.username + this.plainpwd)).substring(0, 22);
      let hashpwd = bcrypt.hashSync(this.plainpwd, salt);
      this.appadmin.password = hashpwd;
    } else {
      this.appadmin.password = "";
    }
    let self = this;
    this.rpcService.getResponse('update_app_user', function (obj: AppAdmin) {
      if (obj == null) return;
      let new_id = obj.id;
      if (self.appadmin.id == new_id) {
        self.appadmin = obj;
      }
      else {
        self.router.navigate(['/appuser/' + new_id]);
      }
      self.readOnlyValue = true;
      self.readOnlyButtonText = "Edit";
      self.messageService.add(self.appadmin.username + " Saved.");
      self.rpcService.getAuthUser(function () { });
    }, null, this.appadmin);
  }
}
