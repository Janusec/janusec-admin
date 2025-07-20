
export interface DNSDomain {
    id: string;
    name: string;
}

export interface DNSRecord {
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
    //SRV = 33,
    //HTTPS = 65,
    //CAA = 257
}