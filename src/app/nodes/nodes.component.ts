import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../message.service';
import { RPCService } from '../rpc.service';
import { Node } from '../models';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit {
  selectedNode: Node;
  constructor(private messageService: MessageService,
    public rpcService: RPCService,
    private router: Router) {
    if (this.rpcService.auth_user.logged) {
      this.rpcService.getAPIKey();
      this.rpcService.getNodesKey();
      this.rpcService.getNodes();
    }
  }

  ngOnInit() {
    if (this.rpcService.auth_user.logged == false) {
      this.router.navigate(['/']);
      return
    }
    if (this.rpcService.auth_user.need_modify_pwd) {
      this.router.navigate(['/appuser/' + this.rpcService.auth_user.user_id]);
    }
  }

  onSelect(node: Node) {
    this.selectedNode = node;
    this.router.navigate(['/node/' + this.selectedNode.id]);
  }

}
