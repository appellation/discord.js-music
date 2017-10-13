# Discord.js Music
A module that adds simple music functionality to Discord.js

### Reference
`Playlist` *extends* [`CassettePlaylist`](https://github.com/appellation/cassette#reference)
- *static* **ensureVoiceConnection(channel: VoiceChannel)**: `Promise<VoiceConnection>` ensure a voice connection.

- **`constructor(guild: Guild)`**

- **guild**: `Guild` *(readonly)* the guild for this playlist
- **playing**: `boolean` *(readonly)* whether the playlist is currently playing

- **stop()**: `void` temporarily stop the playlist without destroying it
- **destroy()**: `void` stop the playlist and destroy it
- **pause()**: `void` pause playlist playback
- **resume()**: `void` resume playlist playback
- **start(channel: VoiceChannel)**: `Promise<void>` start playback in a channel

#### example
```js
// in your main file
require('discord.js-music');

// in some command
const playlist = message.guild.playlist;
await playlist.add(message.content);
return playlist.start(message.member.voiceChannel);
```

