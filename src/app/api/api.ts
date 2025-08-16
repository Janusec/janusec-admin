import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RPCService } from '../services/rpc.service';
import { APIKey } from '../models/gateway';

@Component({
  selector: 'app-api',
  imports: [],
  templateUrl: './api.html',
  styleUrl: './api.css'
})
export class API {

  hexAPIKey: string = '';
  constructor(
    public rpcService: RPCService,
    public cdr: ChangeDetectorRef
  ) {
    // get API key
    var self = this;
    this.rpcService.getResponse('get_api_key', function (obj: APIKey) {
      self.hexAPIKey = obj.api_key;
      self.cdr.detectChanges();
    });
  }

}
