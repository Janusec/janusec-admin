export enum CookieType {
    Necessary = 1,
    Functional = 1 << 1,
    Analytics = 1 << 2,
    Marketing = 1 << 3,
    Unclassified = 1 << 9
}

export interface Cookie {
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
    // local extension for deletion in batch
    selected: boolean;
}

export interface CookieRef {
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
