import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../application.service';
import { MessageService } from '../message.service';
import { Node } from '../models';

@Component({
  selector: 'app-node-detail',
  templateUrl: './node-detail.component.html',
  styleUrls: ['./node-detail.component.css']
})
export class NodeDetailComponent implements OnInit {
  node: Node;
  readOnlyValue: boolean = true;
  readOnlyButtonText: string = "Edit";
  constructor(private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private router: Router,
    private messageService: MessageService) { }

  ngOnInit() {
    this.getNode();
  }

  getNode() {
    let id = +this.route.snapshot.paramMap.get('id');
    if(id>0) {
      var self = this;
      this.applicationService.getResponse('get_node', function(obj: Node){
        if(obj != null) self.node = obj;
      },id);
    } else {
      this.node=new Node();
      this.node.id=0; 
      this.readOnlyValue = false;
      this.readOnlyButtonText="Cancel";
    }    
  }

 
  changeEditable() {
    this.readOnlyValue = !this.readOnlyValue;
    if(this.readOnlyValue) {
      this.readOnlyButtonText="Edit";
    } else {
      this.readOnlyButtonText="Cancel";
    }
  }

  getDate(unix: number): string {
    return new Date(unix*1000).toLocaleString('zh-CN', {hour12: false});
  }

  deleteNode(id: number) {
    this.applicationService.getResponse('del_node', function(){}, id, null);
    this.router.navigate(['/nodes']);
  }

}
