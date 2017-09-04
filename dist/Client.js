"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Client {
    constructor(client, services) {
        this.playlists = new Map();
        this.discord = client;
    }
}
exports.default = Client;
