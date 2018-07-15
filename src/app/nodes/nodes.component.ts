import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { MessageService } from '../message.service';
import { ApplicationService } from '../application.service';
import { GateNode } from '../models';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit {
  selectedNode: GateNode;

  constructor(private messageService: MessageService,
    public applicationService: ApplicationService,
    private router: Router) { }

  ngOnInit() {
    if (this.applicationService.auth_user.logged==false) {
      this.router.navigate(['/']);
      return
    } 
    if (this.applicationService.auth_user.need_modify_pwd) {
      this.router.navigate(['/appuser/'+this.applicationService.auth_user.user_id]);
    }
      this.applicationService.getNodes();
  }

  addNode() {
    this.router.navigate(['/node/0']);
  }

  onSelect(node: GateNode) {
    this.selectedNode = node;
    this.router.navigate(['/node/'+this.selectedNode.id]);
  }

}
