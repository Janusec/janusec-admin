import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthUser, Application, Certificate, Domain, AppAdmin, VulnType, APIResponse, NodesKey, Node, LastRegexLogs, LastCCLogs, OAuthInfo, VipApp } from './models';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApplicationService {
  private apiUrl = '/janusec-admin/api';
  auth_user: AuthUser={
      user_id: 0, 
      username:"", 
      passwd:"", 
      logged:false, 
      is_super_admin:false, 
      is_cert_admin:false, 
      is_app_admin:false,
      need_modify_pwd: false};
  certificates: Certificate[] = [];
  applications: Application[] = [];
  vip_apps: VipApp[] = [];
  appmap: object = new(Object);
  vip_app_map: object = new(Object);
  hexNodesKey: string;
  nodes: Node[] = [];
  domains: Domain[]=[];
  admins: AppAdmin[]=[];
  vulntypes: VulnType[]=[];
  vulntypemap: object = new(Object);
  lastRegexLogs: LastRegexLogs = new(LastRegexLogs);
  lastCCLogs: LastCCLogs = new (LastCCLogs);
  oauth: OAuthInfo = new (OAuthInfo);
  
  constructor(private http: HttpClient,
    private messageService: MessageService) { }

  getResponse(action:string, callback:(obj: object)=>any, id?:number, obj?:object) {
    let body={action: action};
    if(id!=null) body['id']=id;
    if(obj!=null) body['object']=obj;
    this.http.post<APIResponse>(this.apiUrl, body, httpOptions).pipe(
      tap( _ => {}),
      catchError(this.handleError<APIResponse>('Get response'))
    ).subscribe((response: APIResponse) => {  
      if(response.err==null)  {
          callback(response.object);
      }
      else this.messageService.add('Error: ' + response.err);
    });
  }

  getResponseByCustomBody(body:object, callback:(obj: object)=>any) {    
    this.http.post<APIResponse>(this.apiUrl, body, httpOptions).pipe(
      tap( _ => {}),
      catchError(this.handleError<APIResponse>('Get response'))
    ).subscribe((response: APIResponse) => {  
      if(response.err==null)  {
          callback(response.object);
      }
      else this.messageService.add('Error: ' + response.err);
    });
  }

  getResponseByURL(url:string, callback:(obj: object)=>any, id?:number, obj?:object) {
    // Get Request
    this.http.get<APIResponse>(url, httpOptions).pipe(
      tap( _ => {}),
      catchError(this.handleError<APIResponse>('Get response'))
    ).subscribe((response: APIResponse) => {  
      if(response.err==null)  {
          callback(response.object);
      }
      else this.messageService.add('Error: ' + response.err);
    });
  }

  getApplications() {
    var self = this;
    this.getResponse('getapps', function(obj: Application[]){ 
        if(obj==null) {
            self.applications = [];
        } else {
            self.applications = obj;    
            for (let app of self.applications) {
                self.appmap[app.id]=app.name;
            }  
        }
    });
  }

  getVipApps() {
    var self = this;
    this.getResponse('get_vip_apps', function(obj: VipApp[]){
        if(obj==null) {
            self.vip_apps = []; 
        } else {
            self.vip_apps = obj;  
            for (let vip_app of self.vip_apps) {
                self.vip_app_map[vip_app.id]=vip_app.name;
            }  
        }        
    });
  }

  getCertificates() {
    var self = this;
    this.getResponse('getcerts', function(obj: Certificate[]) {
      self.certificates = obj;
      var now_ms = (new Date()).getTime();
      for(let cert of self.certificates) {
        let ms_diff = (new Date(cert.expire_time*1000)).getTime() - now_ms;
        if (ms_diff < 30*86400*1000) {
          cert.due_to_expire=true;
        } else {
          cert.due_to_expire=false;
        }
      }
    });
  }

  getNodesKey():string {
    var self = this;
    this.getResponse('getnodeskey', function(obj: NodesKey) {
      self.hexNodesKey = obj.nodes_key;
    });
    return self.hexNodesKey;
  }

  getNodes() {
    var self = this;
    this.getResponse('getnodes', function(obj: Node[]){
      self.nodes = obj;
      if(self.nodes == null) return;
      var now_ms = (new Date()).getTime();
      for(let node of self.nodes) {
        let ms_diff = now_ms - (new Date(node.last_req_time*1000)).getTime();
        if (ms_diff < 630*1000) {
          node.online=true;
        } else {
          node.online=false;
        }
      }
    });
  }
  
  getAuthUser(callback:(auth_user: AuthUser)=>any) {
    var self = this;
    this.getResponse('getauthuser', function(obj: AuthUser){
      self.auth_user = obj;
      callback(self.auth_user);
    });    
  }

  getVulnTypes(callback:()=>any) {
    var self = this;
    this.getResponse('getvulntypes', function(obj: VulnType[]){
      self.vulntypes = obj;
      for (let vulntype of self.vulntypes) {
        self.vulntypemap[vulntype.id]=vulntype.name;
      }
      callback();
    });    
  }

  getDomains() {
    var self = this;
    this.getResponse('getdomains', function(obj: Domain[]){
      self.domains = obj;
    });
  }

  getAdmins() {
    var self = this;
    this.getResponse('getadmins', function(obj: AppAdmin[]){
      self.admins = obj;
    });
  }


  saveCertificate(cert: Certificate): Observable<Certificate>  {
    let body={action: 'updatecert', certificate: cert};
    return this.http.post<Certificate>(this.apiUrl, body, httpOptions).pipe(
      tap( _ => {}),
      catchError(this.handleError<Certificate>('Save certificate'))
    );
  }


  private handleError<T> (operation = 'operation', result?: T) {
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
