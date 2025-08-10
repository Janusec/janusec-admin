import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { APIResponse } from '../models/rpc';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from './message.service';
import { AppUser, AuthUser } from '../models/auth';
import { Certificate, VipApp } from '../models/application';
import { Application } from '../models/application';
import { GroupPolicy, VulnType } from '../models/security';
import * as cryptojs from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class RPCService {
  private authUser = signal<AuthUser>({
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
  });
  authUser$ = this.authUser.asReadonly();

  private msgService = inject(MessageService)
  private apiUrl = '/janusec-admin/ui-api';
  private http = inject(HttpClient);
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getResponse(action: string, callback: (obj: any) => any, id?: string | null, obj?: object) {
    let body: { action: string; id?: string; object?: object } = {
      action: action
    };
    if (id != null) body.id = id;
    if (obj != null) body.object = obj;
    let self = this;
    this.http.post<APIResponse>(this.apiUrl, body, this.httpOptions).pipe(
      //catchError(this.handleError<APIResponse>('Get response')),
      catchError(error => this.handleHttpError(error))
    ).subscribe(
      ((response: APIResponse) => {
        if (response.err) {
          self.msgService.addWarnMessage('Error: ' + response.err);
        }
        // call back even if the result is null
        callback(response.object);
      }),
    );
  }

  getResponseByCustomBody(body: object, callback: (obj: any) => any) {
    let self = this;
    this.http.post<APIResponse>(this.apiUrl, body, this.httpOptions).pipe(
      //catchError(this.handleError<APIResponse>('Get response'))
      catchError(error => this.handleHttpError(error))
    ).subscribe((response: APIResponse) => {
      if (response.err) {
        self.msgService.addWarnMessage('Error: ' + response.err);
      }
      callback(response.object);
    });
  }

  getResponseByURL(url: string, callback: (obj: any) => any, id?: number, obj?: object) {
    // Get Request
    let self = this;
    this.http.get<APIResponse>(url, this.httpOptions).pipe(
      //catchError(this.handleError<APIResponse>('Get response'))
      catchError(error => this.handleHttpError(error))
    ).subscribe((response: APIResponse) => {
      if (response.err) {
        self.msgService.addWarnMessage('Error: ' + response.err);
      }
      callback(response.object);
    });
  }

  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'unknown error';
    if (error.error instanceof ErrorEvent) {
      // client error
      errorMessage = `client error: ${error.error.message}`;
    } else {
      // server error
      console.log('handleHttpError', error);
      if (error.status === 0) {
        errorMessage = 'unable to connect to the server, check network';
      } else if (error.status >= 500) {
        errorMessage = `server error (${error.status}): ${error.message}`;
      } else if (error.error && typeof error.error === 'object' && error.error.err) {
        // application error
        errorMessage = error.error.err;
      } else {
        errorMessage = `request failed (${error.status}): ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  getAuthUser(callback: (authUser: AuthUser) => any) {
    var self = this;
    this.getResponse('get_auth_user', function (obj: AuthUser) {
      if (obj != null) {
        self.authUser.set(obj);
      }
      // obj may be null, use self.authUser() instead
      callback(self.authUser());
    });
  }

  logout() {
    this.authUser.set({
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
    });
  }

  getDateString(unix: number): string {
    let now = new Date(unix * 1000);
    let nowStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString('en-GB', { hour12: false });
    return nowStr;
  }

  // #region CERTIFICATES

  private certificates = signal<Certificate[]>([]);
  public certificates$ = this.certificates.asReadonly();

  getCertificates(callback: () => any) {
    var self = this;
    this.getResponse('get_certs', function (obj: Certificate[]) {
      self.certificates.set(obj);
      var now_ms = (new Date()).getTime();
      for (let cert of self.certificates()) {
        let ms_diff = (new Date(cert.expire_time * 1000)).getTime() - now_ms;
        if (ms_diff < 30 * 86400 * 1000) {
          cert.due_to_expire = true;
        } else {
          cert.due_to_expire = false;
        }
      }
      callback();
    });
  }

  addOrUpdateLocalCertificate(cert: Certificate) {
    let prevCerts = this.certificates$();
    let updatedCerts: Certificate[];
    const index = prevCerts.findIndex(item => item.id === cert.id);
    if (index > -1) {
      // update
      updatedCerts = prevCerts.map(item =>
        item.id === cert.id ? { ...item, ...cert } : item
      );
      this.certificates.set(updatedCerts);
    } else {
      // add
      this.certificates.update(certs => [...certs, cert]);
    }
  }

  removeLocalCertificate(certID: string) {
    this.certificates.update(certs => certs.filter(cert => cert.id !== certID))
  }

  // #endregion

  // #region APPLICATION


  private applications = signal<Application[]>([]);
  public applications$ = this.applications.asReadonly();

  // appmap['123']='Application Name';
  appmap: Record<string, string> = {};


  getApplications(callback: () => any) {
    var self = this;
    this.getResponse('get_apps', function (obj: Application[]) {
      self.applications.set(obj);
      for (let app of self.applications()) {
        self.appmap[app.id] = app.name;
      }
      callback();
    });
  }

  addOrUpdateLocalApplication(app: Application) {
    let prevApps = this.applications$();
    let updatedApps: Application[];
    const index = prevApps.findIndex(item => item.id === app.id);
    if (index > -1) {
      // update
      updatedApps = prevApps.map(item =>
        item.id === app.id ? { ...item, ...app } : item
      );
      this.applications.set(updatedApps);
    } else {
      // add
      this.applications.update(apps => [...apps, app]);
    }
  }

  removeLocalApplication(appID: string) {
    this.applications.update(apps => apps.filter(app => app.id !== appID))
  }

  // #endregion

  // #region VIPAPP


  private vipApps = signal<VipApp[]>([]);
  public vipApps$ = this.vipApps.asReadonly();

  // vipAppMap['123']='VipApp Name';
  vipAppMap: Record<string, string> = {};


  getVipApps(callback: () => any) {
    var self = this;
    this.getResponse('get_vip_apps', function (obj: VipApp[]) {
      self.vipApps.set(obj);
      for (let app of self.vipApps()) {
        self.vipAppMap[app.id] = app.name;
      }
      callback();
    });
  }

  addOrUpdateLocalVipApp(app: VipApp) {
    let prevApps = this.vipApps$();
    let updatedApps: VipApp[];
    const index = prevApps.findIndex(item => item.id === app.id);
    if (index > -1) {
      // update
      updatedApps = prevApps.map(item =>
        item.id === app.id ? { ...item, ...app } : item
      );
      this.vipApps.set(updatedApps);
    } else {
      // add
      this.vipApps.update(apps => [...apps, app]);
    }
  }

  removeLocalVipApp(appID: string) {
    this.vipApps.update(apps => apps.filter(app => app.id !== appID))
  }

  // #endregion

  // #region USERMGMT

  private appUsers = signal<AppUser[]>([]);
  public appUsers$ = this.appUsers.asReadonly();

  getAppUsers(callback: () => any) {
    var self = this;
    this.getResponse('get_app_users', function (obj: AppUser[]) {
      self.appUsers.set(obj);
      callback();
    });
  }


  addOrUpdateLocalAppUser(appUser: AppUser) {
    let prevAppUsers = this.appUsers$();
    let updatedAppUsers: AppUser[];
    const index = prevAppUsers.findIndex(item => item.id === appUser.id);
    if (index > -1) {
      // update
      updatedAppUsers = prevAppUsers.map(item =>
        item.id === appUser.id ? { ...item, ...appUser } : item
      );
      this.appUsers.set(updatedAppUsers);
    } else {
      // add
      this.appUsers.update(appUsers => [...appUsers, appUser]);
    }
  }

  removeLocalAppUser(appUserID: string) {
    this.appUsers.update(appUsers => appUsers.filter(appUser => appUser.id !== appUserID))
  }

  // #endregion

  // #region WAF GROUP POLICY

  private groupPolicies = signal<GroupPolicy[]>([]);
  public groupPolicies$ = this.groupPolicies.asReadonly();

  getGroupPolicies(callback: () => any) {
    var self = this;
    this.getResponse('get_group_policies', function (obj: GroupPolicy[]) {
      self.groupPolicies.set(obj);
      // calc and update HASH of each policy
      self.groupPolicies.update(groupPolicies =>
        groupPolicies.map(groupPolicy => ({
          ...groupPolicy,
          unique_hash: self.calcUniqueHash(groupPolicy)
        }))
      );
      callback();
    });
  }

  calcUniqueHash(groupPolicy: GroupPolicy) {
    let preHashString = "" + groupPolicy.app_id + groupPolicy.description + groupPolicy.vuln_id + groupPolicy.hit_value + groupPolicy.action;
    for (let check_item of groupPolicy.check_items) {
      preHashString += "^" + check_item.check_point + check_item.operation + check_item.key_name + check_item.regex_policy;
    }
    let hash = String(cryptojs.SHA256(preHashString));
    return hash;
  }


  addOrUpdateLocalGroupPolicy(groupPolicy: GroupPolicy) {
    let prevGroupPolicies = this.groupPolicies$();
    let updatedGroupPolicies: GroupPolicy[];
    const index = prevGroupPolicies.findIndex(item => item.id === groupPolicy.id);
    if (index > -1) {
      // update
      updatedGroupPolicies = prevGroupPolicies.map(item =>
        item.id === groupPolicy.id ? { ...item, ...groupPolicy } : item
      );
      this.groupPolicies.set(updatedGroupPolicies);
    } else {
      // add
      this.groupPolicies.update(groupPolicies => [...groupPolicies, groupPolicy]);
    }
  }

  removeLocalGroupPolicy(groupPolicyID: string) {
    this.groupPolicies.update(groupPolicies => groupPolicies.filter(groupPolicy => groupPolicy.id !== groupPolicyID))
  }

  // #endregion

  // #region WAF GROUP POLICY

  private vulnTypes = signal<VulnType[]>([]);
  public vulnTypes$ = this.vulnTypes.asReadonly();

  getVulnTypes(callback: () => any) {
    var self = this;
    this.getResponse('get_vuln_types', function (obj: VulnType[]) {
      self.vulnTypes.set(obj);
      callback();
    });
  }

  // #endregion

}
