import { IService } from 'cassette';
import { Client as Discord, Snowflake } from 'discord.js';
import Playlist from './Playlist';
export default class Client {
    readonly discord: Discord;
    readonly playlists: Map<Snowflake, Playlist>;
    constructor(client: Discord, services: IService[]);
}
