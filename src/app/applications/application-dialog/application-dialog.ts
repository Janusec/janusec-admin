import { Component, Inject, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { RPCService } from '../../services/rpc.service';
import { MessageService } from '../../services/message.service';
import { OAuthInfo } from '../../models/auth';
import { Application, CustomHeader, Destination, Domain, IPMethod, RouteType } from '../../models/application';
import { Certificate } from '../../models/application';
import { Cookie, CookieType } from '../../models/cookie';
import { CookieDialog } from '../cookie-dialog/cookie-dialog';

export interface IData {
  application: Application;
}

@Component({
  selector: 'app-application-dialog',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTabsModule,
    MatDialogClose,
    MatIcon,
    MatSelectModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatRadioModule
  ],
  templateUrl: './application-dialog.html',
  styleUrl: './application-dialog.css'
})
export class ApplicationDialog {
  rpcService = inject(RPCService);
  application: Application = {
    id: '0',
    name: "XXX",
    internal_scheme: "http",
    redirect_https: true,
    hsts_enabled: false,
    waf_enabled: true,
    shield_enabled: false,
    domains: [],
    ip_method: 1,
    destinations: [],
    oauth_required: false,
    session_seconds: 7200,
    owner: this.rpcService.auth_user$().username,
    csp_enabled: false,
    csp: "",
    cache_enabled: true,
    description: "Used for ...",
    custom_headers: [],
    cookie_mgmt_enabled: false,
    concise_notice: '',
    necessary_notice: '',
    functional_notice: '',
    enable_functional: false,
    analytics_notice: '',
    enable_analytics: false,
    marketing_notice: '',
    enable_marketing: false,
    unclassified_notice: '',
    enable_unclassified: false,
    cookies: []
  };

  constructor(
    private msgService: MessageService,
    //private http: HttpClient,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ApplicationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IData
  ) {
    if (data.application) {
      this.application = data.application;
    }
    if (this.application.id === '0') {
      this.readOnlyValue = false;
    }
    // check certificates
    if (this.rpcService.certificates$().length === 0) {
      this.rpcService.getCertificates(() => { });
    }
    // 
    this.addDomain();
    this.addDestination();
    this.initCookieMgmt();
    if (this.application.cookie_mgmt_enabled) {
      this.getCookiesByAppID(this.application.id);
    }
  }

  readOnlyValue: boolean = true;
  readOnlyButtonText: string = "Edit";
  acme_certificate: Certificate = {
    id: '0',
    common_name: '*.yourdomain.com',
    cert_content: '',
    priv_key_content: '',
    expire_time: 0,
    description: 'ACME certificate',
    due_to_expire: false
  };
  enum_ip_method_values: { value: number; name: string }[] = [];
  enum_route_types: { value: number; name: string }[] = [];
  oauth: OAuthInfo = {
    use_oauth: false,
    display_name: '',
    entrance_url: '',
    authenticator_enabled: false
  };

  k8sRoute = RouteType.K8S_Ingress;

  cookieDataSource = new MatTableDataSource<Cookie>();
  displayedColumns = ['name', 'domain', 'path', 'type', 'vendor', 'duration', 'description', 'action'];
  @ViewChild('cookiePaginator') cookiePaginator!: MatPaginator;
  keyword: string = '';

  cookie_type = CookieType;

  initCookieMgmt() {
    // set default value for cookie mgmt
    if (this.application.concise_notice == null || this.application.concise_notice == '') {
      this.application.concise_notice = "We use necessary cookies to make our site work. We'd also like to set analytics cookies that help us make improvements by measuring how you use the site. These will be set only if you accept. For more detailed information about the cookies we use, see our <a href='/privacy' target='_blank'>Cookie notice</a>.";
    }
    if (this.application.necessary_notice == null || this.application.necessary_notice == '') {
      this.application.necessary_notice = "Necessary cookies enable core functionality such as identity authentication, session management, network management, load balance, language and UI etc. ";
    }
    if (this.application.functional_notice == null || this.application.functional_notice == '') {
      this.application.functional_notice = "Functional cookies help perform certain functionalities such as sharing the content of the website on social media platforms, collecting feedback, and other features.";
    }
    if (this.application.analytics_notice == null || this.application.analytics_notice == '') {
      this.application.analytics_notice = "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous. However, the third parties providing these services, they will process your personal data in order to provide the aggregated data.";
    }
    if (this.application.marketing_notice == null || this.application.marketing_notice == '') {
      this.application.marketing_notice = "These cookies are set by our advertising partners. They are used to build a profile of your interests and show relevant ads on other websites. They do not store directly personal information, but are based on uniquely identifying your browser and internet device. Additionally, the third parties setting these cookies may link your personal data with your browsing behaviour if you are logged into their services at the time.";
    }
    if (this.application.unclassified_notice == null || this.application.unclassified_notice == '') {
      this.application.unclassified_notice = "Unclassified cookies are only used for detection purposes and may come from real business scenarios or detection scans. Only cookies that come from real business scenarios with your consent will take effect.";
    }
  }

  refreshCookies() {
    this.getCookiesByAppID(this.application.id);
  }

  getCookiesByAppID(appID: string) {
    let self = this;
    this.rpcService.getResponse('get_app_cookies', function (objs: Cookie[]) {
      self.application.cookies = objs;
      self.cookieDataSource = new MatTableDataSource<Cookie>(self.application.cookies);
      self.cookieDataSource.paginator = self.cookiePaginator;
    }, appID);
  }

  applyFilter(filterValue: string) {
    this.cookieDataSource.filter = filterValue.trim().toLowerCase();
  }

  setApplication() {
    var self = this;
    this.rpcService.getResponse('update_app', function (obj: Application) {
      if (obj == null) {
        self.msgService.addWarnMessage("Update failed.");
        return;
      }
      self.rpcService.addOrUpdateLocalApplication(obj);
      self.msgService.addSuccessMessage("Application " + obj.name + " saved.");
      self.dialogRef.close();
    }, null, self.application);
  }

  addDestination(): void {
    if (this.readOnlyValue) return;
    let new_dest: Destination = {
      id: '0',
      route_type: RouteType.Reverse_Proxy,
      request_route: '/',
      backend_route: '/',
      destination: "127.0.0.1:8080",
      pods_api: 'http://127.0.0.1:8080/api/v1/namespaces/default/pods',
      pod_port: '80',
      app_id: this.application.id,
      node_id: '0',
      online: true,
      check_time: 0
    };
    this.application.destinations.push(new_dest);
  }

  delDestination(i: number): void {
    if (this.readOnlyValue) return;
    if (this.application.destinations.length == 1) {
      alert("At least one item is required!");
      return;
    }
    this.application.destinations.splice(i, 1);
    //console.log(this.application.destinations);
  }

  addDomain(): void {
    if (this.readOnlyValue) return;
    var new_domain: Domain = {
      name: "",
      id: '0',
      app_id: this.application.id,
      cert_id: '0',
      redirect: false,
      location: ""
    }
    this.application.domains.push(new_domain);
    //console.log(this.application.domains);
  }


  delDomain(i: number): void {
    if (this.readOnlyValue) return;
    if (this.application.domains.length == 1) {
      alert("At least one item is required!");
      return;
    }
    this.application.domains.splice(i, 1);
  }

  addHeader() {
    if (this.readOnlyValue) {
      alert("It is read only now, please click edit button at first");
      return;
    }
    let header: CustomHeader = {
      key: "",
      value: ""
    };
    this.application.custom_headers.push(header);
  }

  delHeader(i: number): void {
    if (this.readOnlyValue) return;
    this.application.custom_headers.splice(i, 1);
  }

  ngOnInit() {
    //init IPMethod enum
    for (var n in IPMethod) {
      if (typeof IPMethod[n] == 'number') {
        this.enum_ip_method_values.push({ value: <any>IPMethod[n], name: n });
      }
    }
    for (var n in RouteType) {
      if (typeof RouteType[n] == 'number') {
        this.enum_route_types.push({ value: <any>RouteType[n], name: n });
      }
    }

    // get oauth config
    let self = this;
    this.rpcService.getResponseByURL('/janusec-admin/oauth/info',
      function (obj: OAuthInfo) {
        if (obj != null) self.oauth = obj;
      });
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  changeEditable() {
    this.readOnlyValue = !this.readOnlyValue;
    if (this.readOnlyValue) {
      this.readOnlyButtonText = "Edit";
    } else {
      this.readOnlyButtonText = "Cancel";
    }
  }

  addCookie() {
    let cookie: Cookie = {
      id: '0',
      app_id: this.application.id,
      name: "",
      domain: "",
      path: "/",
      duration: "365 days",
      vendor: "",
      type: CookieType.Unclassified,
      description: "",
      access_time: 0,
      source: "",
      selected: false
    }
    this.dialog.open(CookieDialog, {
      width: '600px',
      maxWidth: '1000px',
      data: { "cookie": cookie }
    }).afterClosed().subscribe(result => {
      this.getCookiesByAppID(this.application.id);
    });
  }

  editCookie(cookie: Cookie) {
    this.dialog.open(CookieDialog, {
      width: '500px',
      data: { "cookie": cookie }
    }).afterClosed().subscribe(result => {
      this.getCookiesByAppID(this.application.id);
    });
  }

  getCookieTypeName(type: number) {
    return this.cookie_type[type];
  }

  deleteCookie(cookie: Cookie) {
    if (!confirm("Are you sure to delete cookie: " + cookie.name + "?")) return;
    var self = this;
    this.rpcService.getResponse('del_cookie', function () {
      self.getCookiesByAppID(self.application.id);
    }, cookie.id);
  }

  deleteSelectedCookies() {
    if (!confirm("Are you sure to delete these selected cookies?")) return;
    let cookieLen = this.application.cookies.length;
    for (let i = cookieLen - 1; i >= 0; i--) {
      let cookie = this.application.cookies[i];
      if (cookie.selected) {
        this.rpcService.getResponse('del_cookie', function () {
        }, cookie.id);
      }
    }
    setTimeout(() => {
      this.getCookiesByAppID(this.application.id);
    }, 1000);
  }

}
