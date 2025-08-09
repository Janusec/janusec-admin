import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { APIResponse } from '../models/rpc';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from './message.service';
import { AuthUser } from '../models/auth';
import { Certificate, VipApp } from '../models/application';
import { Application } from '../models/application';


@Injectable({
  providedIn: 'root'
})
export class RPCService {
  private auth_user = signal<AuthUser>({
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
  auth_user$ = this.auth_user.asReadonly();

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

  getAuthUser(callback: (auth_user: AuthUser) => any) {
    var self = this;
    this.getResponse('get_auth_user', function (obj: AuthUser) {
      if (obj != null) {
        self.auth_user.set(obj);
      }
      // obj may be null, use self.auth_user() instead
      callback(self.auth_user());
    });
  }

  logout() {
    this.auth_user.set({
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

}
