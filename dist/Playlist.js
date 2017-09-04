"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cassette_1 = require("cassette");
const Error_1 = require("./Error");
class Playlist extends cassette_1.Playlist {
    static get(client, guild) {
        const existing = client.playlists.get(guild.id);
        if (existing)
            return existing;
        const pl = new this(client, guild);
        client.playlists.set(guild.id, pl);
        return pl;
    }
    static ensureVoiceConnection(channel) {
        if (channel.connection)
            return Promise.resolve(channel.connection);
        if (!channel)
            throw new Error_1.default(Error_1.Code.NO_VOICE_CHANNEL);
        if (!channel.joinable)
            throw new Error_1.default(Error_1.Code.NOT_JOINABLE);
        if (!channel.speakable)
            throw new Error_1.default(Error_1.Code.NOT_SPEAKABLE);
        return channel.join();
    }
    constructor(client, guild) {
        super();
        this.client = client;
        this.guild = guild;
    }
    get _dispatcher() {
        return this.guild.voiceConnection ? this.guild.voiceConnection.dispatcher : null;
    }
    get playing() {
        return this._playing;
    }
    stop() {
        return this.end('temp');
    }
    destroy() {
        return this.end('terminal');
    }
    pause() {
        if (this._dispatcher)
            this._dispatcher.pause();
    }
    resume() {
        if (this._dispatcher)
            this._dispatcher.resume();
    }
    start(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Playlist.ensureVoiceConnection(channel);
            yield this._start();
        });
    }
    _start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.stop();
            if (!this.current)
                throw new Error_1.default(Error_1.Code.NO_CURRENT_SONG);
            const stream = yield this.current.stream();
            stream.once('error', () => {
                if (this._dispatcher)
                    this._dispatcher.end();
            });
            if (!this.guild.voiceConnection)
                throw new Error_1.default(Error_1.Code.NO_VOICE_CONNECTION);
            const dispatcher = this.guild.voiceConnection.playStream(stream, { volume: 0.2 });
            this._playing = true;
            dispatcher.once('end', (reason) => __awaiter(this, void 0, void 0, function* () {
                this._playing = false;
                if (reason === 'temp')
                    return;
                if (reason === 'terminal')
                    return this._destroy();
                const next = yield this.next();
                if (!next)
                    return this._destroy();
                yield this._start();
            }));
        });
    }
    end(reason = 'terminal') {
        if (this._dispatcher)
            this._dispatcher.end(reason);
    }
    _destroy() {
        if (this.guild.voiceConnection)
            this.guild.voiceConnection.disconnect();
        this.client.playlists.delete(this.guild.id);
    }
}
exports.default = Playlist;
