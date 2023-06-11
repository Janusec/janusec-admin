import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService } from '../message.service';
import { RPCService } from '../rpc.service';
import { Node } from '../models';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit {
  nodes: Node[] = [];
  selectedNode: Node;
  nodesDataSource: MatTableDataSource<Node>;
  displayedColumns = ['last_ip', 'public_ip', 'online', 'version', 'last_req_time', 'action'];
  nodesLength: number;

  @ViewChild('nodesPaginator') nodesPaginator: MatPaginator;

  constructor(private messageService: MessageService,
    public rpcService: RPCService,
    private router: Router) {
    if (this.rpcService.auth_user.logged) {
      this.rpcService.getNodesKey();
      this.getNodes();
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

  getDate(unix: number): string {
    return this.rpcService.getDateString(unix);
  }

  getNodes() {
    var self = this;
    this.rpcService.getResponse('get_nodes', function (obj: Node[]) {
      self.nodes = obj;
      self.nodesDataSource = new MatTableDataSource<Node>(self.nodes);
      self.nodesLength = self.nodes.length;
      if (self.nodes == null) return;
      var now_ms = (new Date()).getTime();
      for (let node of self.nodes) {
        let ms_diff = now_ms - (new Date(node.last_req_time * 1000)).getTime();
        // recent 2 synchronizations
        if (ms_diff < 360 * 1000) {
          node.online = true;
        } else {
          node.online = false;
        }
      }
    });
  }

  deleteNode(id: string) {
    let self = this;
    this.rpcService.getResponse('del_node', function () {
      self.getNodes();
    }, id, null);
  }

}
