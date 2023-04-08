import { Component, OnInit } from '@angular/core';
import { RPCService } from '../rpc.service';

@Component({
  selector: 'app-api-interface',
  templateUrl: './api-interface.component.html',
  styleUrls: ['./api-interface.component.css']
})
export class ApiInterfaceComponent implements OnInit {

  constructor(public rpcService: RPCService) { }

  ngOnInit(): void {
    this.rpcService.getAPIKey();
  }

}
