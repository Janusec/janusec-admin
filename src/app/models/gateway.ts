
export interface APIKey {
    api_key: string;
}

export interface NodesKey {
    nodes_key: string;
}

export interface Node {
    id: string;
    version: string;
    last_ip: string;
    last_req_time: number;
    online: boolean;
    public_ip: string;
}

export interface RefererHost {
    host: string;
    PV: number;
    UV: number;
}

export interface RefererURL {
    url: string;
    PV: number;
    UV: number;
}

export interface PopContent {
    app_id: string;
    url_path: string;
    amount: number;
}

export interface GateHealth {
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

export interface License {
    edition: string;
    max_users_count: number;
    max_apps_count: number;
    max_concurrency: number;
    expire_time: number;
}

export interface SMTPSetting {
    smtp_enabled: boolean;
    smtp_server: string;
    smtp_port: string;
    smtp_account: string;
    smtp_password: string;
}

export interface PrimarySetting {
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
    shield_html: string;
    smtp: SMTPSetting;
    data_discovery_enabled: boolean;
    data_discovery_api: string;
    data_discovery_tenant_id: string;
    data_discovery_key: string;
    dns_enabled: boolean;
}
export interface DiscoveryRule {
    id: string;
    field_name: string;
    sample: string;
    regex: string;
    description: string;
    editor: string;
    update_time: number;
}
