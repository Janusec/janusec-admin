import { Component, Inject, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { RPCService } from '../../services/rpc.service';
import { MessageService } from '../../services/message.service';
import { RouteType, VipApp, VipTarget } from '../../models/application';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

export interface IData {
  vipApp: VipApp
}

@Component({
  selector: 'app-port-forwarding-dialog',
  imports: [
    FormsModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatExpansionModule,
    MatSelectModule,
    MatDialogModule,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './port-forwarding-dialog.html',
  styleUrl: './port-forwarding-dialog.css'
})
export class PortForwardingDialog {

  private rpcService = inject(RPCService);
  vipApp: VipApp = {
    id: '0',
    name: 'Forwarding 1',
    listen_port: 8001,
    is_tcp: true,
    targets: [],
    owner: this.rpcService.authUser$().username,
    description: 'Used for YYY'
  };

  reverseProxyMode = RouteType.Reverse_Proxy;
  k8sMode = RouteType.K8S_Ingress;

  readOnlyValue: boolean = true;
  readOnlyButtonText: string = "Edit"

  constructor(private route: ActivatedRoute,
    private router: Router,
    private msgService: MessageService,
    public dialogRef: MatDialogRef<PortForwardingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IData) {
    if (data.vipApp !== null) {
      this.vipApp = data.vipApp;
    } else {
      this.readOnlyValue = false;
      this.addTarget();
    }
  }

  addTarget() {
    if (this.readOnlyValue) return;
    let new_target: VipTarget = {
      id: '0',
      vip_app_id: this.vipApp.id,
      route_type: RouteType.Reverse_Proxy,
      destination: "127.0.0.1:4001",
      pods_api: 'http://127.0.0.1:8080/api/v1/namespaces/default/pods',
      pod_port: '80',
      online: true,
      check_time: 0
    }
    this.vipApp.targets.push(new_target);
  }

  delTarget(i: number) {
    if (this.readOnlyValue) return;
    if (this.vipApp.targets.length == 1) {
      alert("At least one item is required!");
      return;
    }
    this.vipApp.targets.splice(i, 1);
  }

  setVipApp() {
    var self = this;
    this.rpcService.getResponse('update_vip_app', function (obj: VipApp) {
      if (obj == null) {
        self.msgService.addWarnMessage("Update failed.");
        return;
      }
      self.rpcService.addOrUpdateLocalVipApp(obj);
      self.msgService.addSuccessMessage("Application " + obj.name + " saved.");
      self.dialogRef.close();
    }, null, self.vipApp);
  }


  changeEditable() {
    this.readOnlyValue = !this.readOnlyValue;
    if (this.readOnlyValue) {
      this.readOnlyButtonText = "Edit";
    } else {
      this.readOnlyButtonText = "Cancel";
    }
  }

}
