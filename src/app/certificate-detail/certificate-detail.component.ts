import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Certificate,APIResponse,SelfSignCert } from '../models';
import { ApplicationService } from '../application.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-certificate-detail',
  templateUrl: './certificate-detail.component.html',
  styleUrls: ['./certificate-detail.component.css']
})
export class CertificateDetailComponent implements OnInit {
  certificate: Certificate;
  readOnlyValue: boolean = true;
  readOnlyButtonText: string = "Edit";
  startDate: Date;
  resp: APIResponse;

  constructor(    
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient
  ) {
    route.params.forEach(params => {
      this.startDate = new Date();
      this.getCertificate();
    });
   }

  getCertificate(): void {
    let id = +this.route.snapshot.paramMap.get('id');
    if(id>0) {
      var self = this;
      this.applicationService.getResponse('getcert', function(obj: Certificate){
        if(obj != null) self.certificate = obj;
      },id);
    } else {
      this.certificate=new Certificate();
      this.certificate.id=0; 
      this.certificate.common_name="*.yourdomain.com";
      this.certificate.description = "New certificate";
      this.readOnlyValue = false;
      this.readOnlyButtonText="Cancel";
    }    
  }

  setCertificate() {
    var self=this;
    this.applicationService.getResponse('update_cert', function(obj: Certificate){
      if(obj != null) {
        let new_id = obj.id;
        if(self.certificate.id == new_id)  {
            self.certificate = obj;
        }       
        else {          
            self.router.navigate(['/certificate/'+ new_id]);
        }
        self.readOnlyValue = true;
        self.readOnlyButtonText="Edit";
        self.messageService.add("Certificate "+ obj.common_name +" Saved.");
      }
    }, null, self.certificate);
  }

  deleteCertificate() {
    if(!confirm("Are you sure to delete certificate: "+this.certificate.common_name+"?")) return;
    var self = this;
    this.applicationService.getResponse('del_cert',function(){
      self.messageService.add(self.certificate.common_name +" deleted.");                  
      self.router.navigate(['/certificates']);
    },this.certificate.id,null);
  }

  selfSignCertificate() {
    var self = this;
    var object = {common_name: this.certificate.common_name};
    this.applicationService.getResponse('self_sign_cert',function(obj: SelfSignCert){
        if(obj != null) {
            self.certificate.cert_content = obj.cert_content;
            self.certificate.priv_key_content = obj.priv_key_content;
        }
    },null,object);
  }

  ngOnInit() {
    this.startDate = new Date();
    this.getCertificate();
  }


  changeEditable() {
    if(this.applicationService.auth_user.is_super_admin==false) return;
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

  readCertificateFile(event) {
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.certificate.cert_content = fileReader.result as string;
      }
      fileReader.readAsText(file)
    }    
  }

  readPrivKeyFile(event) {
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.certificate.priv_key_content = fileReader.result as string;
      }
      fileReader.readAsText(file)
    }    
  }

}
