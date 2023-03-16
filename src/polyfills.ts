/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
* BROWSER POLYFILLS
*/


/** IE10 and IE11 requires the following for NgClass support on SVG elements */
import 'classlist.js';  // Run `npm install --save classlist.js`.

/** IE10 and IE11 requires the following for the Reflect API. */
import 'core-js/es6/reflect';


/**
 * Required to support Web Animations `@angular/platform-browser/animations`.
 * Needed for: All but Chrome, Firefox and Opera. http://caniuse.com/#feat=web-animation
 **/
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.



/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js/dist/zone';  // Included with Angular CLI.



/***************************************************************************************************
 * APPLICATION IMPORTS
 */

import { loadTranslations } from '@angular/localize';

let zhTranslations = {
    // navbar, general
    'login': '登录',
    'lang': 'English',
    'description': '描述',
    'save': '保存',
    'cancel': '取消',
    'delete': '删除',
    'view': '查看',
    // app left menu
    'basic_configuration': '基本配置',
    'security_defense': '安全防御',
    'security_operation': '安全运维',
    'security_audit': '安全审计',
    'cc_defense': "CC防御",
    'ip_policy': 'IP策略',
    'cert_mgmt': '证书管理',
    'app_mgmt': '应用管理',
    'node_mgmt': '节点管理',
    'user_mgmt': '用户管理',
    'dashboard': '仪表盘',
    'waf_mgmt': 'WAF管理',
    'waf_logs': 'WAF日志',
    'cc_logs': 'CC日志',
    'hide_menu': '隐藏导航',
    'show_menu': '显示导航',
    'health_check': '健康检查',
    'data_privacy': '数据隐私',
    // frontpage
    'product_name': 'JANUSEC应用网关',
    'product_desc': 'JANUSEC应用网关，提供WAF、CC攻击防御、LDAP及OAuth2身份认证、统一Web化管理入口、证书私钥保护、Web SSH安全运维，Web路由以及可扩展的负载均衡等功能。',
    'feature_title': 'JANUSEC应用网关主要特性：',
    'feature_waf': 'WAF(Web应用防火墙)，CC防护',
    'feature_full_site_https': '全站HTTPS: 证书管理与私钥加密',
    'feature_oauth': '身份认证: LDAP、CAS2、企业微信扫码、钉钉扫码、飞书扫码、Lark扫码',
    'support': '支持',
    'official_site': 'JANUSEC官方网站',
    'source_code': '源代码',
    'user_agreement': '用户协议',
    // login form
    'login_title': '管理登录',
    'authenticator_code': '认证码',
    'authenticator_code_tip': '首次使用000000',
    'submit': '提交',
    // authenticator
    'authenticator_register': '认证器注册',
    'authenticator_notice': '请使用手机认证码APP (Google Authenticator或Microsoft Authenticator) 扫描如下二维码：',
    'input_key_notice': '或直接在移动APP中输入密钥: ',
    'input_code_notice': '输入6位认证码',
    'verify': '验证并注册',
    // certificates
    'add_cert': '添加证书',
    'common_name': '通用名',
    'expire_time': '到期时间',
    'cert_status': '证书状态',
    'acme_note': '注：此处导入的证书私钥将被加密存储；ACME自动证书由文件系统自动管理（不在此处列出）。',
    // certificate-detail
    'cert_detail_title': '证书配置',
    'cert_common_name': '通用名/使用者可选名称',
    'cert_public': '证书公钥（以-----BEGIN CERTIFICATE-----开头）',
    'cert_priv': '证书私钥（以-----BEGIN PRIVATE KEY-----开头）',
    'cert_expire': '到期时间',
    'cert_self_sign': '自签名证书',
    // Applications
    'add_app': '添加应用',
    'waf_enabled2': 'WAF启用',
    // Application Detail
    'app_detail': '应用配置',
    'app_name': '应用名称',
    'app_internal_scheme': '后端/内部Scheme（网关访问后端使用HTTP还是HTTPS，默认HTTP）',
    'app_destination': '目标地址及端口（如：10.10.10.10:80 或者 [::1%lo]:8080 ）',
    'add_new_routing': '添加新的路由',
    'domain_name': '域名（必填）',
    'domain_name_tooltip': '必填，格式：www.your-domain.com',
    'certificate': '证书',
    'acme_requirement': '如果使用ACME自动证书，网关须使用默认80/443端口、向互联网开放、单节点部署',
    'automated_certificate': 'ACME自动证书',
    'redirect': '（默认不勾选）重定向到： ',
    'add_domain': '添加域名',
    'ip_for_waf': '网关获取用户IP地址的方式（默认REMOTE_ADDR，流量来自其他CDN时才需要修改）',
    'redirect_https': '将HTTP请求重定向到HTTPS（需要配置证书）',
    'hsts_enabled': '启用HSTS（添加头部Strict-Transport-Security，一年内仅使用HTTPS）',
    'waf_enabled': '启用WAF（Web应用防火墙）',
    'cache_enabled': '启用静态文件缓存（仅限10MB以内文件，支持brotli与gzip压缩加速）',
    'shield_enabled': '启用5秒盾拦截爬虫（默认不启用，需要SEO的网站请在设置中维护搜索引擎清单，谨慎开启）',
    'oauth_required': '启用身份认证（需在设置中登记提供商并启用，用于内部员工登录企业内部网站）',
    'session_seconds': '启用OAuth2时，会话超时时间（默认7200秒）',
    'owner': '应用负责人（使用登录用户名或完整的英文ID，只有应用管理员和应用负责人才能操作应用）',
    'request_location': '请求路由',
    'routing_type': '路由类型（反向代理/FastCGI/静态网站/Ingress）',
    'destination': '目标IP:Port（如为静态网站填写默认文件名）',
    'backend_routing': '后端路由或绝对路径',
    'routing_configuration': '路由配置',
    'domain_configuration': '域名配置',
    'reference_configuration': '配置参考',
    'csp_enabled': "启用CSP(内容安全策略，如default-src 'self'，默认不启用)",
    'request_location_tooltip': '默认 / ,选项包括： /abc/  .php  /  ；优先级从高到低，不支持多级路由如 /abc/def/ ',
    'routing_type_tooltip': '默认Reverse_Proxy（反向代理）, Local_FastCGI 用于PHP/Python等, Static_Website 用于本地静态网站(无后端服务器)，K8S_Ingress用于K8S Pods反向代理',
    'destination_tooltip': '默认 IP:Port （如10.0.0.1:80）, 用于静态网站时填写默认文件名（如index.html）',
    'backend_routing_tooltip': '默认 / , 前后端路径不一致时可使用 /xyz/ 这种形式，本地静态网站或FastCGI网站请填写绝对路径 /path/to/www/ ',
    // Port forwarding
    'port_forwarding': '端口转发',
    'vip_note': '注：本模块为四层TCP/UDP端口转发（无WAF/CC防护功能）。',
    'port_forwarding_warning': '注意：端口转发可能带来严重的安全风险，只能用于非Web应用发布，使用时请遵守内部安全管理规定。',
    'vip_app': '端口转发',
    'add_vip': '添加端口转发',
    'forward_note': '注：仅支持直接从监听端口响应的服务（不支持多个端口或反向连接）。',
    'target_configuration': '后端配置',
    'add_new_target': '新增后端IP:Port',
    'listen_port': '监听端口(1025-65535)',
    'listen_port2': '监听端口',
    'protocol': '协议',
    'target': '后端IP:Port',
    'forward_mode': '转发模式',
    'vip_owner': '应用负责人',
    // Health Check
    'gateway_status': '网关状态',
    'hosts_status': '主机状态',
    'host_status_by_application': '按应用查看主机状态',
    'offline_hosts': '离线主机',
    'unvisited_hosts': '24小时内零访问量主机',
    'start_time': '启动时间',
    'current_time': '当前时间',
    'version': '版本',
    'time_zone': '时区',
    'cpu_percent': 'CPU百分比',
    'cpu_load1_5_15': 'CPU负载(1/5/15分钟)',
    'mem_used': '内存使用',
    'mem_total': '内存总量',
    'disk_used': '存储使用',
    'disk_total': '存储总量',
    'concurrency': '并发数',
    'refresh': '刷新',
    // nodes
    'node_notice': '请复制如下node_key到所有从节点config.json文件中：',
    'node_detail': '节点详情',
    // User Management
    'add_user': '添加用户',
    'is_super_admin': '超级管理员',
    'is_cert_admin': '证书管理员',
    'is_app_admin': '应用管理员',
    // User Details
    'user_details': '用户配置',
    'confirm_password': '确认口令',
    'email': '邮箱地址(用于发送告警)',
    'super_admin': '超级管理员（授予/撤销用户权限，管理WAF/CC规则）',
    'certificate_admin': '证书管理员（可管理所有证书内容）',
    'application_admin': '应用管理员（可管理所有应用）',
    // Dash Board
    'application': '请选择应用',
    'all': '所有',
    'vulnerability': '请选择漏洞类型',
    'popular_content_today': '今日流行内容',
    'referring_sites': '来源网站（14天）',
    // WAF, Firewall, CC
    'global_vuln_policy': '全局WAF规则',
    'global_cc_policy': '全局CC防护规则',
    'enabled': '启用',
    'add_policy': '添加规则',
    'export_policies': '导出规则',
    'import_policies': '导入规则',
    'global_cc_title': '全局CC防护规则（优先级小于自定义规则）',
    'custom_cc_policy': '自定义CC防护规则',
    'custom_cc_title': '自定义CC防护规则（请先选中一个应用）',
    'select_application': '选择一个应用',
    'add_custom_cc_policy': '添加自定义CC规则',
    'count_each_url': '单独统计每个URL地址的访问次数（默认选中，当只需要统计无差别的全站访问次数时，不勾选）',
    'count_each_ua': '单独统计每个User-Agent的访问次数（默认不勾选）',
    'count_each_cookie': '单独统计每个不同的Cookie串（默认不勾选，当Cookie中使用了时间戳或Cookie会经常变化时，不勾选）',
    'enable_policy': '启用该规则（默认选中）',
    "interval_milliseconds": '统计时间窗（默认100毫秒）',
    'max_count': '最大请求数（默认6次）',
    'block_seconds': '超限锁定（默认900秒）',
    'action': '动作',
    'slow_cc_notice': '注：慢速CC检测同时启用，使用15个统计时间窗（其他参数相同）。',
    'ip_policy_allow': '放行：WAF适用则允许安全测试，CC适用则允许高频访问。',
    'ip_policy_block': '阻断：WAF单独适用则显示阻断信息，CC适用则封禁访问。',
    'add_ip': '添加IP',
    'ip_addr': 'IP地址',
    'is_allow': '动作',
    'allow': '放行',
    'block': '阻断',
    'applicable': '适用',
    'not_applicable': '不适用',
    'ip_operation': '操作',
    // Policy
    'policy_detail': 'WAF规则配置',
    'policy_description': '规则名称或描述',
    'apply_to': '用于哪个应用',
    'check_point': '检查点',
    'operation': '运算 (正则匹配 / 字符串相等且不区分大小写 / 大于指定的整数 / 等于指定的整数 / 长度大于指定的整数 / 正则不匹配)',
    'designated_headerkey': '指定HTTP头部Key(可选)',
    'value_or_regex': '值或正则表达式（使用Google RE2规则，(?i)开头表示不区分大小写）',
    'add_new_checkpoint': '添加新的检查点',
    'update_time': '更新时间',
    'regex_test_tool': '正则表达式测试工具',
    'regex_pattern': '正则表达式（采用Google RE2正则，单行模式）',
    'payload_to_test': '用来测试的payload用例',
    'matched_result': '匹配结果',
    'regex_preprocess': '使用内置WAF预处理（需勾选，会统一删除单双引号，用空格替换/**/，自定义规则不需要处理单双引号和/**/）',
    'test': '测试',
    // WAF log
    'begin_time': '开始时间(00:00:00)',
    'end_time': '结束时间(23:59:59)',
    'query_waf_logs': '查询WAF日志',
    'query_cc_logs': '查询CC日志',
    'log_details': 'WAF日志详情',
    // CC Log
    'cc_log_details': 'CC日志详情',
    'go_back': '后退',
    // Web SSH
    'web_ssh_term': '在线SSH运维终端',
    'ip_address': '目标主机IP地址',
    'port': '端口',
    'username': '用户名',
    'password': '口令',
    // Referring
    'referring_site': '来源网站',
    'target_site': '目标网站',
    'referring_link': '来源链接',
    // Settings
    'global_settings': '全局设置',
    'security_auth': '身份认证',
    'authenticator_enabled': '为网关后台管理启用双因子身份认证（认证器）',
    'auth_enabled': '为应用启用统一身份认证',
    'auth_provider': '认证服务提供商',
    'access_control_five_second_shield': '访问控制（5秒盾）',
    'five_second_shield': '5秒盾',
    'search_engine_list': '搜索引擎清单',
    'skip_se_enabled': '允许下列搜索引擎绕过5秒盾（如需SEO请允许）',
    'search_engine_label': '搜索引擎（不能为空，不区分大小写，使用英文半角 | 分隔）',
    'five_second_shield_note': '注：当应用开启5秒盾，且允许搜索引擎绕过时，5秒盾不拦截上面列出的搜索引擎(User-Agent)。',
    'access_control_operation': '访问控制（运维）',
    'webssh_enabled': '启用基于Web的SSH运维通道',
    'waf_log_days': 'WAF日志保存天数',
    'cc_log_days': 'CC日志保存天数',
    'access_log_days': '访问日志保存天数',
    'display_name': '显示名称',
    'callback': '回调地址',
    // LDAP
    'bind_required': '启用BindDN（适用于Active Directory）',
    'using_tls': '使用TLS加密通道',
    'no_tls': '无TLS',
    'enable_authenticator': '启用双因子身份认证器（Authenticator）',
    'no_authenticator': '无认证器（Authenticator）',
    'auth_provider_note': '注：如果修改了身份认证配置，子节点的JANUSEC服务需重新启动。',
    'email_notification': '邮件提醒',
    'smtp_enabled': '启用SMTP邮件提醒（证书30天内到期/后端服务器离线等）',
    'smtp_server': '服务器',
    'smtp_port': '端口(25, 587, 465)',
    'smtp_account': '发送账号(Email地址)',
    'smtp_password': '口令(或专用访问Token)',
    'test_smtp': '测试SMTP',
    // data discovery
    'manage_discovery_rules': '管理数据发现规则',
    'data_discovery': '数据发现',
    'enable_json_data_discovery': '启用JSON数据发现（仅限已开启WAF的应用）',
    'api_key': 'API密钥',
    'data_discovery_rule': '数据发现规则',
    'field_name': '字段名',
    'sample': '样本',
    'add_discovery_rule': "添加数据发现规则",
    'regex': '正则表达式',
    'back_to_settings': '返回设置',
    'data_discovery_note': '注：数据发现功能模块与JANUCAT集成（CAT即Compliance, Accountability and Transparency）'
}


var lang = localStorage.getItem('lang');
switch (lang) {
    case 'zh-cn':
        loadTranslations(zhTranslations);
        break;
    default:
        break;
}