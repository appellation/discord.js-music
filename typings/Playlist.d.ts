import { Playlist as Cassette } from 'cassette';
import { Guild, VoiceChannel, VoiceConnection } from 'discord.js';
import Client from './Client';
export declare type EndReason = 'temp' | 'terminal';
export default class Playlist extends Cassette {
    static get(client: Client, guild: Guild): Playlist;
    static ensureVoiceConnection(channel: VoiceChannel): Promise<VoiceConnection>;
    readonly client: Client;
    readonly guild: Guild;
    private _playing;
    constructor(client: Client, guild: Guild);
    private readonly _dispatcher;
    readonly playing: boolean;
    stop(): void;
    destroy(): void;
    pause(): void;
    resume(): void;
    start(channel: VoiceChannel): Promise<void>;
    private _start();
    private end(reason?);
    private _destroy();
}
