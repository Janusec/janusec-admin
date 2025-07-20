export interface AuthUser {
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

export interface AppUser {
    id: string;
    username: string;
    password: string;
    email: string;
    is_super_admin: boolean;
    is_cert_admin: boolean;
    is_app_admin: boolean;
    need_modify_pwd: boolean;
}

export interface OAuthInfo {
    use_oauth: boolean;
    display_name: string;
    entrance_url: string;
    authenticator_enabled: boolean;
}

export interface WxworkConfig {
    display_name: string;
    callback: string;
    corpid: string;
    agentid: string;
    corpsecret: string;
}

export interface DingtalkConfig {
    display_name: string;
    callback: string;
    appid: string;
    appsecret: string;
    corpid: string; // added on Mar 23, 2024
}

export interface FeishuConfig {
    display_name: string;
    callback: string;
    appid: string;
    appsecret: string;
}

export interface LarkConfig {
    display_name: string;
    callback: string;
    appid: string;
    appsecret: string;
}

export interface LDAPConfig {
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

export interface CAS2Config {
    display_name: string;
    entrance: string;
    callback: string;
}
