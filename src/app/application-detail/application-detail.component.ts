import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Application, Domain, Certificate, APIResponse, Destination, IPMethod, RouteType, CustomHeader, CookieType, Cookie } from '../models';
import { RPCService } from '../rpc.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '../message.service';
import { OAuthInfo } from '../models';
import { CookieDialogComponent } from '../cookie-dialog/cookie-dialog.component';

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
  acme_certificate: Certificate;
  enum_ip_method_values: { value: number; name: string }[] = [];
  enum_route_types: { value: number; name: string }[] = [];
  oauth: OAuthInfo = new (OAuthInfo);

  k8sRoute = RouteType.K8S_Ingress;

  cookieDataSource: MatTableDataSource<Cookie>;
  displayedColumns = ['name', 'domain', 'path', 'type', 'vendor', 'duration', 'description', 'action'];
  cookieLength: number;
  keyword: string;

  cookie_type = CookieType;

  @ViewChild('cookiePaginator') cookiePaginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private rpcService: RPCService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    public dialog: MatDialog
  ) {
    /*
    route.params.forEach(params => {
      this.getApplication();
    });
    */
  }

  getApplication(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != '0') {
      var self = this;
      this.rpcService.getResponse('get_app', function (obj: Application) {
        if (obj != null) {
          self.application = obj;
          self.initCookieMgmt();
          if (self.application.cookie_mgmt_enabled) {
            self.getCookiesByAppID(self.application.id);
          }
        }
      }, id);
    } else {
      this.readOnlyValue = false;
      this.application = new Application();
      this.application.id = '0';
      this.application.name = "XXX";
      this.application.internal_scheme = "http";
      this.application.redirect_https = true;
      this.application.hsts_enabled = false;
      this.application.waf_enabled = true;
      this.application.shield_enabled = false;
      this.application.domains = [];
      this.application.ip_method = 1;
      this.application.destinations = [];
      this.application.oauth_required = false;
      this.application.session_seconds = 7200;
      this.application.owner = this.rpcService.auth_user.username;
      this.application.csp_enabled = false;
      this.application.csp = "";
      this.application.cache_enabled = true;
      this.application.description = "Used for ...";
      this.application.custom_headers = [];
      this.addDomain();
      this.addDestination();
      this.initCookieMgmt();
    }
  }

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
      self.cookieLength = self.application.cookies.length;
    }, appID, null);
  }

  applyFilter(filterValue: string) {
    this.cookieDataSource.filter = filterValue.trim().toLowerCase();
  }

  setApplication() {
    var self = this;
    this.rpcService.getResponse('update_app', function (obj: Application) {
      if (obj == null) {
        self.messageService.add("Update failed.");
        return;
      }
      let new_id = obj.id;
      if (self.application.id == new_id) {
        self.application = obj;
      }
      else {
        self.application.id = new_id;
        self.router.navigate(['/application/' + new_id]);
      }
      self.readOnlyValue = true;
      self.readOnlyButtonText = "Edit";
      self.messageService.add("Application " + obj.name + " saved.");
    }, null, self.application);
  }

  deleteApplication() {
    if (!confirm("Are you sure to delete application: " + this.application.name + "?")) return;
    var self = this;
    this.rpcService.getResponse('del_app', function () {
      self.messageService.add(self.application.name + " deleted.");
      self.router.navigate(['/applications']);
    }, this.application.id, null);
  }

  addDestination(): void {
    if (this.readOnlyValue) return;
    var new_dest: Destination = new Destination();
    new_dest.id = '0';
    new_dest.route_type = RouteType.Reverse_Proxy;
    new_dest.request_route = '/';
    new_dest.backend_route = '/';
    new_dest.destination = "127.0.0.1:8080";
    new_dest.pods_api = 'http://127.0.0.1:8080/api/v1/namespaces/default/pods';
    new_dest.pod_port = '80';
    new_dest.app_id = this.application.id;
    new_dest.node_id = '0';
    this.application.destinations.push(new_dest);
    //console.log(this.application.destinations);
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
    var new_domain: Domain = new Domain();
    new_domain.name = "";
    new_domain.id = '0';
    new_domain.app_id = this.application.id;
    new_domain.cert_id = '0';
    new_domain.redirect = false;
    new_domain.location = "";
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

    if (this.rpcService.domains == null || this.rpcService.domains.length == 0) {
      this.rpcService.getDomains();
    }
    if (this.rpcService.certificates == null || this.rpcService.certificates.length == 0) {
      this.rpcService.getCertificates();
    }
    this.getApplication();
    this.acme_certificate = new Certificate();
    this.acme_certificate.id = '0';
    this.acme_certificate.common_name = 'Automated Certificate';
    this.getCertificates();

    // get oauth config
    let self = this;
    this.rpcService.getResponseByURL('/janusec-admin/oauth/info',
      function (obj: OAuthInfo) {
        if (obj != null) self.oauth = obj;
      });
  }


  getCertificates() {
    var self = this;
    this.rpcService.getResponse('get_certs', function (obj: Certificate[]) {
      if (obj != null) self.optionCertificates = obj; //.concat(self.acme_certificate);
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
    this.dialog.open(CookieDialogComponent, {
      width: '500px',
      data: { "cookie": cookie }
    }).afterClosed().subscribe(result => {
      this.getCookiesByAppID(this.application.id);
    });
  }

  editCookie(cookie: Cookie) {
    this.dialog.open(CookieDialogComponent, {
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
    }, cookie.id, null);
  }

  deleteSelectedCookies() {
    if (!confirm("Are you sure to delete these selected cookies?")) return;
    let cookieLen = this.application.cookies.length;
    for (let i = cookieLen - 1; i >= 0; i--) {
      let cookie = this.application.cookies[i];
      if (cookie.selected) {
        this.rpcService.getResponse('del_cookie', function () {
        }, cookie.id, null);
      }
    }
    setTimeout(() => {
      this.getCookiesByAppID(this.application.id);
    }, 1000);
  }

}
