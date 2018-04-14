import { Guild } from 'discord.js';
import Playlist from './Playlist';

export default class GuildExtension extends Guild {
  public static applyToClass(target: any): void {
    for (const prop of [
      'playlist',
    ]) {
      const desc = Object.getOwnPropertyDescriptor(this.prototype, prop);
      if (desc) Object.defineProperty(target.prototype, prop, desc);
    }
  }

  private _playlist?: Playlist;

  get playlist() {
    if (!this._playlist) this._playlist = new Playlist(this);
    return this._playlist;
  }
}
