import { Component, OnInit, ViewChild } from '@angular/core';
import { Router }            from '@angular/router';
import { Application, Certificate } from '../models';
import { ApplicationService } from '../application.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit {
  
  //selectedCertificate: Certificate;
  certIcon: string = "assets/images/cert.png";
  //two_month_later: Date;

  certDataSource: MatTableDataSource<Certificate>;
  displayedColumns = ['id', 'common_name', 'description', 'expire_time', 'due_to_expire'];
  certLength: number;
  keyword: string;

  @ViewChild('certPaginator') certPaginator: MatPaginator;

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
    setTimeout(() => 
    {
      this.certDataSource = new MatTableDataSource<Certificate>(this.applicationService.certificates);
      this.certLength = this.applicationService.certificates.length;
    },500); 
  }

  addDays(theDate, days) {
    return new Date(theDate.getTime() + days*86400*1000);
  }

  /*
  onSelect(certificate: Certificate): void {
    this.selectedCertificate = certificate;
    this.router.navigate(['/certificate/'+this.selectedCertificate.id]);
  }
  */
 
  addCertificate() {
    this.router.navigate(['/certificate/0']);
  }

  getDate(unix: number): string {
    return this.applicationService.getDateString(unix);
  }

  applyFilter(filterValue: string) {
    this.certDataSource.filter = filterValue.trim().toLowerCase();
  }

}
