import { ValueConverter } from '@angular/compiler/src/render3/view/template';

export class AuthUser {
    user_id: string;
    username: string;
    passwd: string;
    logged: boolean;
    is_super_admin: boolean;
    is_cert_admin: boolean;
    is_app_admin: boolean;
    need_modify_pwd: boolean;
    totp_key: string;
    totp_verified: boolean;
}

export class AppUser {
    id: string;
    username: string;
    password: string;
    email: string;
    is_super_admin: boolean;
    is_cert_admin: boolean;
    is_app_admin: boolean;
    need_modify_pwd: boolean;
}

export class Application {
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
    long_notice_link: string;
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
}

export class VipApp {
    id: string;
    name: string;
    listen_port: number;
    is_tcp: boolean;
    targets: VipTarget[];
    owner: string;
    description: string;
}

export class VipTarget {
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

export class Certificate {
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

export class Destination {
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

export class SelfSignCert {
    cert_content: string;
    priv_key_content: string;
}

export class Domain {
    id: string;
    name: string;
    app_id: string;
    cert_id: string;
    redirect: boolean;
    location: string;
}


export interface APIResponse {
    err: string;
    object: any
}

export class CCPolicy {
    app_id: string;
    interval_milliseconds: number;
    max_count: number;
    block_seconds: number;
    action: number;
    stat_by_url: boolean;
    stat_by_ua: boolean;
    stat_by_cookie: boolean;
    is_enabled: boolean;
}

export enum ChkPoint {
    Host = 1,
    IPAddress = 1 << 1,
    Method = 1 << 2,
    URLPath = 1 << 3,
    URLQuery = 1 << 4,
    FileExt = 1 << 5,
    // ValueLength         = 1 << 6,
    GetPostKey = 1 << 7,
    GetPostValue = 1 << 8,
    UploadFileExt = 1 << 9,
    Referer = 1 << 10,
    CookieKey = 1 << 11,
    CookieValue = 1 << 12,
    UserAgent = 1 << 13,
    ContentType = 1 << 14,
    HeaderKey = 1 << 15,
    HeaderValue = 1 << 16,
    Proto = 1 << 17,
    ResponseStatusCode = 1 << 25,
    ResponseHeaderKey = 1 << 26,
    ResponseHeaderValue = 1 << 27,
    //ResponseBodyLength  = 1 << 28,
    ResponseBody = 1 << 29
}

export enum PolicyAction {
    BLOCK = 100,
    BYPASS_AND_LOG = 200,
    CAPTCHA = 300,
    OK_PASS = 400
}

export class VulnType {
    id: number;
    name: string;
}

export class GroupPolicy {
    id: string;
    description: string;
    app_id: string;
    vuln_id: number;
    check_items: CheckItem[];
    hit_value: number;
    action: PolicyAction;
    is_enabled: boolean;
    // extends
    unique_hash: string;
}

export enum Operation {
    Regex_Match = 1,
    Equals_String_Case_Insensitive = 1 << 1,
    Greater_Than_Integer = 1 << 2,
    Equals_Integer = 1 << 3,
    Length_Greater_Than_Integer = 1 << 4,
    Regex_Not_Match = 1 << 5
}

export class CheckItem {
    id: string;
    check_point: ChkPoint;
    operation: Operation;
    key_name: string;
    regex_policy: string;
    group_policy_id: string;
}

export class RegexMatch {
    pattern: string;
    payload: string;
    matched: boolean;
    preprocess: boolean;
}

export class APIKey {
    api_key: string;
}

export class NodesKey {
    nodes_key: string;
}

export class Node {
    id: string;
    version: string;
    last_ip: string;
    last_req_time: number;
    online: boolean;
    public_ip: string;
}

export class CCLog {
    id: string;
    request_time: number;
    client_ip: string;
    host: string;
    method: string;
    url_path: string;
    url_query: string;
    content_type: string;
    user_agent: string;
    cookies: string;
    raw_request: string;
    action: PolicyAction;
    app_id: string;
}

export class RegexHitLog {
    id: string;
    request_time: number;
    client_ip: string;
    host: string;
    method: string;
    url_path: string;
    url_query: string;
    content_type: string;
    user_agent: string;
    cookies: string;
    raw_request: string;
    action: PolicyAction;
    policy_id: string;
    app_id: string;
}

export class SimpleRegexHitLog {
    id: string;
    request_time: number;
    client_ip: string;
    host: string;
    method: string;
    url_path: string;
    action: PolicyAction;
    policy_id: string;
    app_id: string;
}

export class SimpleCCLog {
    id: string;
    request_time: number;
    client_ip: string;
    host: string;
    method: string;
    url_path: string;
    action: PolicyAction;
    app_id: string;
}

export class RegexHitLogsCount {
    app_id: string;
    start_time: number;
    end_time: number;
    count: number;
}

export class CCLogsCount {
    app_id: string;
    start_time: number;
    end_time: number;
    count: number;
}

export class LastRegexLogs {
    app_id: string;
    start_date: Date;
    end_date: Date;
    page_index: number;
    length: number;
    regex_logs: SimpleRegexHitLog[] = [];
}

export class LastCCLogs {
    app_id: string;
    start_date: Date;
    end_date: Date;
    page_index: number;
    length: number;
    cc_logs: SimpleCCLog[] = [];
}

export class VulnStat {
    vuln_id: number;
    count: number;
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

export class OAuthInfo {
    use_oauth: boolean;
    display_name: string;
    entrance_url: string;
    authenticator_enabled: boolean;
}

export class RefererHost {
    host: string;
    PV: number;
    UV: number;
}

export class RefererURL {
    url: string;
    PV: number;
    UV: number;
}

export class PopContent {
    app_id: string;
    url_path: string;
    amount: number;
}

export class GateHealth {
    start_time: number;
    cur_time: number;
    version: string;
    cpu_percent: number;
    cpu_load1: number;
    cpu_load5: number;
    cpu_load15: number;
    mem_used: number;
    mem_total: number;
    disk_used: number;
    disk_total: number;
    time_zone: string;
    time_offset: number;
    concurrency: number;
}

export class License {
    edition: string;
    max_users_count: number;
    max_apps_count: number;
    max_concurrency: number;
    expire_time: number;
}

export class SMTPSetting {
    smtp_enabled: boolean;
    smtp_server: string;
    smtp_port: string;
    smtp_account: string;
    smtp_password: string;
}

export class PrimarySetting {
    authenticator_enabled: boolean;
    auth_enabled: boolean;
    auth_provider: string;
    webssh_enabled: boolean;
    waf_log_days: number;
    cc_log_days: number;
    access_log_days: number;
    skip_se_enabled: boolean;
    search_engines: string;
    block_html: string;
    smtp: SMTPSetting;
    data_discovery_enabled: boolean;
    data_discovery_api: string;
    data_discovery_tenant_id: string;
    data_discovery_key: string;
    dns_enabled: boolean;
}

export class IPPolicy {
    id: string;
    ip_addr: string;
    is_allow: boolean;
    apply_to_waf: boolean;
    apply_to_cc: boolean;
    editable: boolean;
}

export class WxworkConfig {
    display_name: string;
    callback: string;
    corpid: string;
    agentid: string;
    corpsecret: string;
}

export class DingtalkConfig {
    display_name: string;
    callback: string;
    appid: string;
    appsecret: string;
}

export class FeishuConfig {
    display_name: string;
    callback: string;
    appid: string;
    appsecret: string;
}

export class LarkConfig {
    display_name: string;
    callback: string;
    appid: string;
    appsecret: string;
}

export class LDAPConfig {
    display_name: string;
    entrance: string;
    address: string;
    dn: string;
    using_tls: boolean;
    authenticator_enabled: boolean;
    bind_required: boolean;
    base_dn: string;
    bind_username: string;
    bind_password: string;
}

export class CAS2Config {
    display_name: string;
    entrance: string;
    callback: string;
}

export class DiscoveryRule {
    id: string;
    field_name: string;
    sample: string;
    regex: string;
    description: string;
    editor: string;
    update_time: number;
}

export enum CookieType {
    Necessary = 1,
    Functional = 1 << 1,
    Analytics = 1 << 2,
    Marketing = 1 << 3,
    Unclassified = 1 << 9
}

export class Cookie {
    id: string;
    app_id: string;
    name: string;
    domain: string;
    path: string;
    duration: string;
    vendor: string;
    type: CookieType;
    description: string;
    access_time: number;
    source: string;
}

export class CookieRef {
    id: string;
    name: string;
    vendor: string;
    type: CookieType;
    description: string;
    operation: CookieOperation;
}

export enum CookieOperation {
    EqualsString = 1,
    BeginWithString = 1 << 1,
    RegexMatch = 1 << 2
}

export class DNSDomain {
    id: string;
    name: string;
}

export class DNSRecord {
    id: string;
    dns_domain_id: string;
    rrtype: RRType;
    name: string;
    value: string;
    ttl: number;
    auto: boolean;
    internal: boolean;
}

// A, AAAA, CNAME, MX, TXT, SRV, NS, HTTPS, CAA
export enum RRType {
    A = 1,
    NS = 2,
    CNAME = 5,
    MX = 15,
    TXT = 16,
    AAAA = 28,
    SRV = 33,
    HTTPS = 65,
    CAA = 257
}