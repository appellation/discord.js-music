import { IService } from 'cassette';
import { Client as Discord, Snowflake } from 'discord.js';
import Playlist from './Playlist';

export default class Client {
  public readonly discord: Discord;
  public readonly playlists: Map<Snowflake, Playlist> = new Map();

  constructor(client: Discord, services: IService[]) {
    this.discord = client;
  }
}
