import { Cookie } from "./cookie";

export interface Application {
    id: string;
    name: string;
    internal_scheme: string;
    redirect_https: boolean;
    hsts_enabled: boolean;
    waf_enabled: boolean;
    shield_enabled: boolean;
    destinations: Destination[];
    domains: Domain[];
    ip_method: IPMethod;
    description: string;
    oauth_required: boolean;
    session_seconds: number;
    owner: string;
    csp_enabled: boolean;
    csp: string;
    cache_enabled: boolean;
    // cookie mgmt
    cookie_mgmt_enabled: boolean;
    concise_notice: string;
    //long_notice_link: string;
    necessary_notice: string;
    functional_notice: string;
    enable_functional: boolean; // without consent
    analytics_notice: string;
    enable_analytics: boolean; // without consent
    marketing_notice: string;
    enable_marketing: boolean; // without consent
    unclassified_notice: string;
    enable_unclassified: boolean; // without consent
    cookies: Cookie[];
    custom_headers: CustomHeader[];
}

export interface CustomHeader {
    key: string;
    value: string;
}

export interface Destination {
    id: string;
    route_type: RouteType;
    request_route: string;
    backend_route: string;
    destination: string;
    pods_api: string;
    pod_port: string;
    //pods: string;
    app_id: string;
    node_id: string;
    online: boolean;
    check_time: number;
}


export interface VipApp {
    id: string;
    name: string;
    listen_port: number;
    is_tcp: boolean;
    targets: VipTarget[];
    owner: string;
    description: string;
}

export interface VipTarget {
    id: string;
    vip_app_id: string;
    route_type: RouteType;
    destination: string;
    pods_api: string;
    pod_port: string;
    //pods: string;
    online: boolean;
    check_time: number;
}

export enum IPMethod {
    REMOTE_ADDR = 1,
    X_Forwarded_For = 1 << 1,
    X_REAL_IP = 1 << 2,
    REAL_IP = 1 << 3
}

export interface Certificate {
    id: string;
    common_name: string;
    cert_content: string;
    priv_key_content: string;
    expire_time: number;
    description: string;
    due_to_expire: boolean;
}

export enum RouteType {
    Reverse_Proxy = 1,
    Local_FastCGI = 1 << 1,
    Static_Website = 1 << 2,
    K8S_Ingress = 1 << 3
}

export interface SelfSignCert {
    cert_content: string;
    priv_key_content: string;
}

export interface Domain {
    id: string;
    name: string;
    app_id: string;
    cert_id: string;
    redirect: boolean;
    location: string;
}

export class Server {
    ip: string;
    port: string;
    username: string;
    password: string;

    constructor(ip: string, port: string, username: string, password: string) {
        this.ip = ip;
        this.port = port;
        this.username = username;
        this.password = password;
    }
}