import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Application, Certificate } from '../models';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit {
  
  selectedCertificate: Certificate;
  certIcon: string = "assets/images/cert.png";
  //two_month_later: Date;

  constructor(
    public applicationService: ApplicationService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.applicationService.auth_user.logged==false) {
      this.router.navigate(['/']);
      return
    } 
    if (this.applicationService.auth_user.need_modify_pwd) {
      this.router.navigate(['/appuser/'+this.applicationService.auth_user.user_id]);
    }
    this.applicationService.getCertificates();
  }

  addDays(theDate, days) {
    return new Date(theDate.getTime() + days*86400*1000);
  }

  onSelect(certificate: Certificate): void {
    this.selectedCertificate = certificate;
    this.router.navigate(['/certificate/'+this.selectedCertificate.id]);
  }

  addCertificate() {
    this.router.navigate(['/certificate/0']);
  }

  getDate(unix: number): string {
    return new Date(unix*1000).toLocaleString('zh-CN', {hour12: false});
  }

}
