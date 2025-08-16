
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