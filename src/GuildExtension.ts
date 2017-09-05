import { Guild } from 'discord.js';
import Playlist from './Playlist';

export default class GuildExtension extends Guild {
  public static applyToClass(target: any): void {
    for (const prop of [
      '_playlist',
      'playlist',
    ]) Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(this.prototype, prop));
  }

  private _playlist: Playlist;

  get playlist() {
    if (!this._playlist) this._playlist = new Playlist(this);
    return this._playlist;
  }
}
