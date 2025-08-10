import { Component, Inject, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Certificate, SelfSignCert } from '../../models/application';
import { RPCService } from '../../services/rpc.service';
import { MessageService } from '../../services/message.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { FileReaderService } from '../../services/filereader.service';
import { MatIcon } from '@angular/material/icon';

export interface IData {
  certificate: Certificate
}

@Component({
  selector: 'app-certificate-dialog',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatDialogActions,
    MatDialogClose,
    MatIcon
  ],
  templateUrl: './certificate-dialog.html',
  styleUrl: './certificate-dialog.css'
})
export class CertificateDialog {
  certificate: Certificate = {
    id: '0',
    common_name: '*.yourdomain.com',
    cert_content: '',
    priv_key_content: '',
    expire_time: 0,
    description: 'New certificate',
    due_to_expire: false
  };
  readOnlyValue: boolean = true;
  readOnlyButtonText: string = "Edit";

  constructor(
    public rpcService: RPCService,
    private cdr: ChangeDetectorRef,
    private msgService: MessageService,
    private fileReaderService: FileReaderService,
    public dialogRef: MatDialogRef<CertificateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IData) {
    if (data.certificate !== null) {
      this.certificate = data.certificate;
    } else {
      this.readOnlyValue = false;
    }
  }

  setCertificate() {
    if (this.certificate.cert_content.length < 5) {
      return;
    }
    var self = this;
    this.rpcService.getResponse('update_cert', function (obj: Certificate) {
      if (obj != null) {
        self.rpcService.addOrUpdateLocalCertificate(obj);
        self.msgService.addSuccessMessage("Certificate " + obj.common_name + " saved.");
      }
      self.dialogRef.close();
    }, null, self.certificate);
  }

  selfSignCertificate() {
    let self = this;
    let object = { common_name: this.certificate.common_name };
    this.rpcService.getResponse('self_sign_cert', function (obj: SelfSignCert) {
      if (obj != null) {
        self.certificate.cert_content = obj.cert_content;
        self.certificate.priv_key_content = obj.priv_key_content;
        self.cdr.detectChanges();
      }
    }, null, object);
  }

  changeEditable() {
    if (!this.rpcService.authUser$().is_cert_admin) return;
    this.readOnlyValue = !this.readOnlyValue;
    if (this.readOnlyValue) {
      this.readOnlyButtonText = "Edit";
    } else {
      this.readOnlyButtonText = "Cancel";
    }
  }

  getDate(unix: number): string {
    return this.rpcService.getDateString(unix);
  }

  async readCertificateFile(event: any): Promise<void> {
    const file: File = event.target.files[0];
    if (!file) return;
    try {
      this.certificate.cert_content = await this.fileReaderService.readFileAsText(file);
      this.cdr.detectChanges();
    } catch (error: any) {
      this.msgService.addWarnMessage('read file error');
    }
  }

  async readPrivKeyFile(event: any): Promise<void> {
    const file: File = event.target.files[0];
    if (!file) return;
    try {
      this.certificate.priv_key_content = await this.fileReaderService.readFileAsText(file);
      this.cdr.detectChanges();
    } catch (error: any) {
      this.msgService.addWarnMessage('read file error');
    }
  }

}
