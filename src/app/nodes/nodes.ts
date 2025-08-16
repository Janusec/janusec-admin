import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MessageService } from '../services/message.service';
import { RPCService } from '../services/rpc.service';
import { Node, NodesKey } from '../models/gateway';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-nodes',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIcon
  ],
  templateUrl: './nodes.html',
  styleUrl: './nodes.css'
})
export class Nodes {
  nodes: Node[] = [];
  dataSource = new MatTableDataSource<Node>();
  displayedColumns = ['last_ip', 'public_ip', 'online', 'version', 'last_req_time', 'action'];

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(private msgService: MessageService,
    public cdr: ChangeDetectorRef,
    public rpcService: RPCService,
    private router: Router) {
    if (this.rpcService.authUser$().logged) {
      this.getNodesKey();
      this.getNodes();
    }
  }

  ngOnInit() {
    if (this.rpcService.authUser$().logged == false) {
      this.router.navigate(['/']);
      return
    }
    if (this.rpcService.authUser$().need_modify_pwd) {
      this.msgService.addWarnMessage('Please modify your password!');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getDate(unix: number): string {
    return this.rpcService.getDateString(unix);
  }

  getNodes() {
    var self = this;
    this.rpcService.getResponse('get_nodes', function (obj: Node[]) {
      self.nodes = obj;
      self.dataSource = new MatTableDataSource<Node>(self.nodes);
      self.dataSource.paginator = self.paginator;

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
      self.cdr.detectChanges();
    });
  }

  deleteNode(id: string) {
    let self = this;
    this.rpcService.getResponse('del_node', function () {
      self.getNodes();
    }, id);
  }

  hexNodesKey: string = '';
  getNodesKey() {
    var self = this;
    this.rpcService.getResponse('get_nodes_key', function (obj: NodesKey) {
      self.hexNodesKey = obj.nodes_key;
      self.cdr.detectChanges();
    });
  }

}
