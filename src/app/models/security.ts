export interface CCPolicy {
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

export interface VulnType {
    id: number;
    name: string;
}

export interface GroupPolicy {
    id: string;
    description: string;
    app_id: string;
    vuln_id: number;
    check_items: CheckItem[];
    hit_value: number;
    action: PolicyAction;
    is_enabled: boolean;
    update_time: number;
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

export interface CheckItem {
    id: string;
    check_point: ChkPoint;
    operation: Operation;
    key_name: string;
    regex_policy: string;
    group_policy_id: string;
}

export interface RegexMatch {
    pattern: string;
    payload: string;
    matched: boolean | null;
    preprocess: boolean;
}


export interface CCLog {
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

export interface RegexHitLog {
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

export interface SimpleRegexHitLog {
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

export interface SimpleCCLog {
    id: string;
    request_time: number;
    client_ip: string;
    host: string;
    method: string;
    url_path: string;
    action: PolicyAction;
    app_id: string;
}

export interface RegexHitLogsCount {
    app_id: string;
    start_time: number;
    end_time: number;
    count: number;
}

export interface CCLogsCount {
    app_id: string;
    start_time: number;
    end_time: number;
    count: number;
}

export interface LastRegexLogs {
    app_id: string;
    start_date: Date;
    end_date: Date;
    page_index: number;
    length: number;
    regex_logs: SimpleRegexHitLog[];
}

export interface LastCCLogs {
    app_id: string;
    start_date: Date;
    end_date: Date;
    page_index: number;
    length: number;
    cc_logs: SimpleCCLog[];
}

export interface VulnStat {
    vuln_id: number;
    count: number;
}

export interface IPPolicy {
    id: string;
    ip_addr: string;
    is_allow: boolean;
    apply_to_waf: boolean;
    apply_to_cc: boolean;
    create_time: number;
    description: string;
    editable: boolean;
}