import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthUser, Application, Certificate, Domain, AppUser, VulnType, APIResponse, NodesKey, Node, LastRegexLogs, LastCCLogs, OAuthInfo, VipApp, License, APIKey } from './models';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RPCService {
  private apiUrl = '/janusec-admin/ui-api';
  auth_user: AuthUser = {
    user_id: '0',
    username: "",
    passwd: "",
    logged: false,
    is_super_admin: false,
    is_cert_admin: false,
    is_app_admin: false,
    need_modify_pwd: false,
    totp_key: "",
    totp_verified: false
  };
  certificates: Certificate[] = [];
  applications: Application[] = [];
  vip_apps: VipApp[] = [];
  appmap: object = new (Object);
  vip_app_map: object = new (Object);
  hexAPIKey: string;
  hexNodesKey: string;

  domains: Domain[] = [];
  admins: AppUser[] = [];
  vulntypes: VulnType[] = [];
  vulntypemap: object = new (Object);
  lastRegexLogs: LastRegexLogs = new (LastRegexLogs);
  lastCCLogs: LastCCLogs = new (LastCCLogs);
  oauth: OAuthInfo = new (OAuthInfo);
  license: License;

  constructor(private http: HttpClient,
    private messageService: MessageService) { }

  getResponse(action: string, callback: (obj: object) => any, id?: string, obj?: object) {
    let body = { action: action };
    if (id != null) body['id'] = id;
    if (obj != null) body['object'] = obj;
    this.http.post<APIResponse>(this.apiUrl, body, httpOptions).pipe(
      tap(_ => { }),
      catchError(this.handleError<APIResponse>('Get response'))
    ).subscribe((response: APIResponse) => {
      if (response.err == null) {
        callback(response.object);
      }
      else this.messageService.add('Error: ' + response.err);
    });
  }

  getResponseByCustomBody(body: object, callback: (obj: object) => any) {
    this.http.post<APIResponse>(this.apiUrl, body, httpOptions).pipe(
      tap(_ => { }),
      catchError(this.handleError<APIResponse>('Get response'))
    ).subscribe((response: APIResponse) => {
      if (response.err == null) {
        callback(response.object);
      }
      else this.messageService.add('Error: ' + response.err);
    });
  }

  getResponseByURL(url: string, callback: (obj: object) => any, id?: number, obj?: object) {
    // Get Request
    this.http.get<APIResponse>(url, httpOptions).pipe(
      tap(_ => { }),
      catchError(this.handleError<APIResponse>('Get response'))
    ).subscribe((response: APIResponse) => {
      if (response.err == null) {
        callback(response.object);
      }
      else this.messageService.add('Error: ' + response.err);
    });
  }

  getApplications() {
    var self = this;
    this.getResponse('get_apps', function (obj: Application[]) {
      if (obj == null) {
        self.applications = [];
      } else {
        self.applications = obj;
        for (let app of self.applications) {
          self.appmap[app.id] = app.name;
        }
      }
    });
  }

  getVipApps() {
    var self = this;
    this.getResponse('get_vip_apps', function (obj: VipApp[]) {
      if (obj == null) {
        self.vip_apps = [];
      } else {
        self.vip_apps = obj;
        for (let vip_app of self.vip_apps) {
          self.vip_app_map[vip_app.id] = vip_app.name;
        }
      }
    });
  }

  getCertificates() {
    var self = this;
    this.getResponse('get_certs', function (obj: Certificate[]) {
      self.certificates = obj;
      var now_ms = (new Date()).getTime();
      for (let cert of self.certificates) {
        let ms_diff = (new Date(cert.expire_time * 1000)).getTime() - now_ms;
        if (ms_diff < 30 * 86400 * 1000) {
          cert.due_to_expire = true;
        } else {
          cert.due_to_expire = false;
        }
      }
    });
  }

  getAPIKey(): string {
    var self = this;
    this.getResponse('get_api_key', function (obj: APIKey) {
      self.hexAPIKey = obj.api_key;
    });
    return self.hexAPIKey;
  }

  getNodesKey(): string {
    var self = this;
    this.getResponse('get_nodes_key', function (obj: NodesKey) {
      self.hexNodesKey = obj.nodes_key;
    });
    return self.hexNodesKey;
  }

  getAuthUser(callback: (auth_user: AuthUser) => any) {
    var self = this;
    this.getResponse('get_auth_user', function (obj: AuthUser) {
      self.auth_user = obj;
      callback(self.auth_user);
    });
  }

  getVulnTypes(callback: () => any) {
    var self = this;
    this.getResponse('get_vuln_types', function (obj: VulnType[]) {
      self.vulntypes = obj;
      for (let vulntype of self.vulntypes) {
        self.vulntypemap[vulntype.id] = vulntype.name;
      }
      callback();
    });
  }

  getDomains() {
    var self = this;
    this.getResponse('get_domains', function (obj: Domain[]) {
      self.domains = obj;
    });
  }

  getAppUsers() {
    var self = this;
    this.getResponse('get_app_users', function (obj: AppUser[]) {
      self.admins = obj;
    });
  }


  saveCertificate(cert: Certificate): Observable<Certificate> {
    let body = { action: 'update_cert', certificate: cert };
    return this.http.post<Certificate>(this.apiUrl, body, httpOptions).pipe(
      tap(_ => { }),
      catchError(this.handleError<Certificate>('Save certificate'))
    );
  }


  getDateString(unix: number): string {
    let now = new Date(unix * 1000);
    let nowStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString('en-GB', { hour12: false });
    return nowStr;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.messageService.add(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
