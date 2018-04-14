import { Guild, Structures } from 'discord.js';

import Error from './Error';
import Playlist from './Playlist';

declare module 'discord.js' {
  interface Guild {
    playlist: Playlist;
  }
}

Structures.extend('Guild', Guild => {
  return class GuildExtension extends Guild {
    public playlist: Playlist = new Playlist(this);
  }
});

export {
  Error,
  Playlist,
};
