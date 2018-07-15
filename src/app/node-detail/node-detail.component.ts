import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../application.service';
import { MessageService } from '../message.service';
import { GateNode } from '../models';

@Component({
  selector: 'app-node-detail',
  templateUrl: './node-detail.component.html',
  styleUrls: ['./node-detail.component.css']
})
export class NodeDetailComponent implements OnInit {
  node: GateNode;
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
      this.applicationService.getResponse('getnode', function(obj: GateNode){
        self.node = obj;
      },id);
    } else {
      this.node=new GateNode();
      this.node.id=0; 
      this.node.name="Node00X";      
      this.readOnlyValue = false;
      this.readOnlyButtonText="Cancel";
    }    
  }

  setNode() {
    var self=this;
    this.applicationService.getResponse('updatenode', function(obj: GateNode){
      let new_id = obj.id;
      if(self.node.id == new_id)  {
        self.node = obj;
      }       
      else {          
        self.router.navigate(['/node/'+ new_id]);
      }
      self.readOnlyValue = true;
      self.readOnlyButtonText="Edit";
      self.messageService.add("GateNode "+ obj.name +" Saved.");
    }, null, self.node);
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

}
