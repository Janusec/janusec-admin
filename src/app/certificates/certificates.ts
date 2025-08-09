import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RPCService } from '../services/rpc.service';
import { Certificate } from '../models/application';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MessageService } from '../services/message.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CertificateDialog } from './certificate-dialog/certificate-dialog';

@Component({
  selector: 'app-certificates',
  imports: [
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    MatIcon,
    MatDivider,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './certificates.html',
  styleUrl: './certificates.css'
})
export class Certificates {
  dataSource = new MatTableDataSource<Certificate>();
  displayedColumns = ['common_name', 'description', 'expire_time', 'due_to_expire', 'action'];
  keyword: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public rpcService: RPCService,
    public msgService: MessageService,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    if (!this.rpcService.auth_user$().logged) {
      this.router.navigate(['/']);
      return
    }
    if (this.rpcService.auth_user$().need_modify_pwd) {
      this.router.navigate(['/appuser/' + this.rpcService.auth_user$().user_id]);
    }
    let self = this;
    this.rpcService.getCertificates(() => {
      self.dataSource.data = self.rpcService.certificates$();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getDate(unix: number): string {
    return this.rpcService.getDateString(unix);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  delCertificate(cert: Certificate) {
    if (!confirm("Are you sure to delete certificate: " + cert.common_name + "?")) return;
    var self = this;
    this.rpcService.getResponse('del_cert', function () {
      self.rpcService.removeLocalCertificate(cert.id);
      self.dataSource.data = self.rpcService.certificates$();
      self.msgService.addWarnMessage(cert.common_name + " deleted.");
    }, cert.id);
  }

  openCertificateDialog(cert: Certificate | null) {
    this.dialog.open(CertificateDialog, {
      width: '800px',
      maxWidth: '1000px',
      data: { "certificate": cert ? { ...cert } : null }
    }).afterClosed().subscribe(result => {
      this.dataSource.data = this.rpcService.certificates$();
    });
  }

}
