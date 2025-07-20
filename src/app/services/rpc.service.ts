import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIResponse } from '../models/rpc';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { AuthUser } from '../models/auth';
import { License } from '../models/gateway';

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
      catchError(this.handleError<APIResponse>('Get response'))
    ).subscribe(
      ((response: APIResponse) => {
        if (response.err) {
          console.log('Error: ' + response.err);
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
      catchError(this.handleError<APIResponse>('Get response'))
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
      catchError(this.handleError<APIResponse>('Get response'))
    ).subscribe((response: APIResponse) => {
      if (response.err) {
        self.msgService.addWarnMessage('Error: ' + response.err);
      }
      callback(response.object);
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.msgService.addWarnMessage(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
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
}
