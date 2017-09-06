import { Guild } from 'discord.js';

import Error from './Error';
import GuildExtension from './GuildExtension';
import Playlist from './Playlist';

GuildExtension.applyToClass(Guild);

export {
  Error,
  GuildExtension,
  Playlist,
};
