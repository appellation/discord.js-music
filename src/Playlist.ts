import { Playlist as Cassette, Song } from 'cassette';
import { Client, Guild, StreamDispatcher, VoiceChannel, VoiceConnection } from 'discord.js';

import Error, { Code } from './Error';
import GuildExtension from './GuildExtension';

export type EndReason = 'temp' | 'terminal';

export default class Playlist extends Cassette {
  public static ensureVoiceConnection(channel: VoiceChannel): Promise<VoiceConnection> {
    if (channel.connection) return Promise.resolve(channel.connection);

    if (!channel) throw new Error(Code.NO_VOICE_CHANNEL);
    if (!channel.joinable) throw new Error(Code.NOT_JOINABLE);
    if (!channel.speakable) throw new Error(Code.NOT_SPEAKABLE);
    return channel.join();
  }

  public readonly guild: GuildExtension;
  private _playing: boolean = false;

  constructor(guild: GuildExtension) {
    super();
    this.guild = guild;
  }

  private get _dispatcher(): StreamDispatcher | null {
    return this.guild.voiceConnection ? this.guild.voiceConnection.dispatcher : null;
  }

  get playing(): boolean {
    return this._playing;
  }

  public stop(): void {
    return this.end('temp');
  }

  public destroy(): void {
    return this.end('terminal');
  }

  public pause(): void {
    if (this._dispatcher) this._dispatcher.pause();
  }

  public resume(): void {
    if (this._dispatcher) this._dispatcher.resume();
  }

  public async start(channel: VoiceChannel): Promise<void> {
    await Playlist.ensureVoiceConnection(channel);
    await this._start();
  }

  private async _start(): Promise<void> {
    this.stop();

    if (!this.current) throw new Error(Code.NO_CURRENT_SONG);
    const stream = await this.current.stream();
    stream.once('error', () => {
      if (this._dispatcher) this._dispatcher.end();
    });

    if (!this.guild.voiceConnection) throw new Error(Code.NO_VOICE_CONNECTION);
    const dispatcher = this.guild.voiceConnection.playStream(stream, { volume: 0.2 });
    this._playing = true;

    dispatcher.once('end', async (reason: EndReason | 'user') => {
      this._playing = false;

      if (reason === 'temp') return;
      if (reason === 'terminal') return this._destroy();

      const next = await this.next();
      if (!next) return this._destroy();

      await this._start();
    });
  }

  private end(reason: EndReason = 'terminal'): void {
    if (this._dispatcher) this._dispatcher.end(reason);
  }

  private _destroy(): void {
    if (this.guild.voiceConnection) this.guild.voiceConnection.disconnect();
    this.guild.playlist.reset();
  }
}
