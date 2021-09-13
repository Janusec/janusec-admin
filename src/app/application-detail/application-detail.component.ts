import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Application, Domain, Certificate,APIResponse, Destination, IPMethod, RouteType } from '../models';
import { ApplicationService } from '../application.service'; 
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '../message.service';
import { OAuthInfo } from '../models'

@Component({
  selector: 'app-application-detail',
  templateUrl: './application-detail.component.html',
  styleUrls: ['./application-detail.component.css']
})
export class ApplicationDetailComponent implements OnInit {
  @Input() application: Application;
  readOnlyValue: boolean = true;
  readOnlyButtonText: string = "Edit";
  optionCertificates: Certificate[];
  acme_certificate:Certificate;
  enum_ip_method_values: {value: number; name: string}[] = [];
  enum_route_types: {value: number; name: string}[] = [];
  oauth: OAuthInfo = new (OAuthInfo);

  constructor(    
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient
  ) {
    /*
    route.params.forEach(params => {
      this.getApplication();
    });
    */
  }

  getApplication(): void {
    const id = +this.route.snapshot.paramMap.get('id');    
    if(id>0) {
      var self = this;
      this.applicationService.getResponse('get_app', function(obj: Application){     
          if(obj != null) self.application = obj;
      },id);
    } else {
      this.readOnlyValue = false;
      this.application=new Application();
      this.application.id=0;
      this.application.name="XXX";
      this.application.internal_scheme="http";
      this.application.redirect_https=true;
      this.application.hsts_enabled=false;
      this.application.waf_enabled=true;
      this.application.shield_enabled=false;
      this.application.domains=[];
      this.application.ip_method=1;
      this.application.destinations=[];
      this.application.oauth_required=false;
      this.application.session_seconds=7200;
      this.application.owner=this.applicationService.auth_user.username;
      this.application.csp_enabled=false;
      this.application.csp="";
      this.application.cache_enabled=true;
      this.application.description="Used for ...";
      this.addDomain();
      this.addDestination();
    }
  }

  setApplication() {
    var self=this;
    this.applicationService.getResponse('update_app', function(obj: Application){
      if(obj==null) {
        self.messageService.add("Update failed.");
        return;
      }
      let new_id = obj.id;
      if(self.application.id == new_id)  {
        self.application = obj;
      }       
      else {
        self.application.id = new_id;
        self.router.navigate(['/application/'+ new_id]);
      }
      self.readOnlyValue = true;
      self.readOnlyButtonText="Edit";
      self.messageService.add("Application "+ obj.name +" Saved.");
    }, null, self.application);
  }

  deleteApplication() {
    if(!confirm("Are you sure to delete application: "+this.application.name+"?")) return;
    var self = this;
    this.applicationService.getResponse('del_app',function(){
      self.messageService.add(self.application.name +" deleted.");                  
      self.router.navigate(['/applications']);
    },this.application.id,null);
  }

  addDestination(): void {
    if(this.readOnlyValue) return;
    var new_dest: Destination=new Destination();
    new_dest.id = 0;
    new_dest.route_type = RouteType.Reverse_Proxy;
    new_dest.request_route = '/';
    new_dest.backend_route = '/';
    new_dest.destination = "127.0.0.1:8080";
    new_dest.app_id = this.application.id;
    new_dest.node_id = 0;
    this.application.destinations.push(new_dest);
    //console.log(this.application.destinations);
  }

  delDestination(i: number): void {
    if(this.readOnlyValue) return;
    if(this.application.destinations.length==1) {
      alert("At least one item is required!");
      return;
    }
    this.application.destinations.splice(i,1);
    //console.log(this.application.destinations);
  }

  addDomain():void{
    if(this.readOnlyValue) return;
    var new_domain: Domain=new Domain();
    new_domain.name="";
    new_domain.id=0;
    new_domain.app_id=this.application.id;
    new_domain.cert_id=0;
    new_domain.redirect=false;
    new_domain.location="";
    this.application.domains.push(new_domain);
    //console.log(this.application.domains);
  }


  delDomain(i:number):void{
    if(this.readOnlyValue) return;
    if(this.application.domains.length==1) {
      alert("At least one item is required!");
      return;
    }
    this.application.domains.splice(i,1);
  }
  
  ngOnInit() {
    //init IPMethod enum
    for(var n in IPMethod) {
      if (typeof IPMethod[n] == 'number') {
        this.enum_ip_method_values.push({value: <any>IPMethod[n], name: n});
      }
    }
    for(var n in RouteType) {
      if (typeof RouteType[n] == 'number') {
        this.enum_route_types.push({value: <any>RouteType[n], name: n});
      }
    }
    
    if(this.applicationService.domains==null || this.applicationService.domains.length==0) {
      this.applicationService.getDomains();
    }
    if(this.applicationService.certificates==null || this.applicationService.certificates.length==0) {
      this.applicationService.getCertificates();
    }    
    this.getApplication();
    this.acme_certificate = new Certificate();
    this.acme_certificate.id=0;
    this.acme_certificate.common_name='Automated Certificate';
    this.getCertificates();

    // get oauth config
    let self=this;  
    this.applicationService.getResponseByURL('/janusec-admin/oauth/info',
      function(obj: OAuthInfo){
        if(obj != null) self.oauth=obj;
      });
  }


  getCertificates() {
    var self = this;
    this.applicationService.getResponse('get_certs', function(obj: Certificate[]){      
        if(obj != null) self.optionCertificates = obj; //.concat(self.acme_certificate);
    });
  }


  trackByFn(index: any, item: any) {
    return index;
  }
 
  changeEditable() {
    this.readOnlyValue = !this.readOnlyValue;
    if(this.readOnlyValue) {
      this.readOnlyButtonText="Edit";
    } else {
      this.readOnlyButtonText="Cancel";
    }
  }

}
