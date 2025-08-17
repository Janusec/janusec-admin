import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RPCService } from '../services/rpc.service';
//import { MessageService } from '../services/message.service';
import { RefererURL } from '../models/gateway';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';

export interface IData {
  appID: string;
  host: string;
}

@Component({
  selector: 'app-referer-links-dialog',
  imports: [
    MatIcon,
    FlexLayoutModule,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './referer-links-dialog.html',
  styleUrl: './referer-links-dialog.css'
})
export class RefererLinksDialog {

  appID: string;
  host: string;
  refererLinks: RefererURL[] = [];

  constructor(private route: ActivatedRoute,
    public rpcService: RPCService,
    private cdr: ChangeDetectorRef,
    //private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: IData) {
    this.appID = data.appID;
    this.host = data.host;
    this.getRefererURLs(this.appID, this.host);
  }

  getRefererURLs(app_id: string, host: string) {
    let body = { action: "get_referer_urls", app_id: app_id, host: host }
    let self = this;
    this.rpcService.getResponseByCustomBody(body, function (referer_urls: RefererURL[]) {
      self.refererLinks = referer_urls;
      self.cdr.detectChanges();
    });
  }

  getAppNameByID(appID: string) {
    if (appID == '0') return 'All';
    return this.rpcService.appMap[appID];
  }
}
