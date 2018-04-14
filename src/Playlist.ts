import EventEmitter = require('events');
import { Playlist as Cassette, Song } from 'cassette';
import { Client, Guild, StreamDispatcher, StreamOptions, VoiceChannel, VoiceConnection } from 'discord.js';

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

  public readonly events: EventEmitter = new EventEmitter();
  public readonly guild: GuildExtension;
  private _playing: boolean = false;
  protected _endListener: () => any = () => {};

  constructor(guild: GuildExtension) {
    super();
    this.guild = guild;
  }

  private get _dispatcher(): StreamDispatcher | null {
    return this.guild.voiceConnection ? this.guild.voiceConnection.dispatcher : null;
  }

  public get playing(): boolean {
    return this._playing;
  }

  public next() {
    const hasNext = super.next();
    if (this._playing) this._end();
    return hasNext;
  }

  public stop(): void {
    this._endListener = () => {
      // do nothing
    };

    return this._end();
  }

  public destroy(): void {
    this.reset();
    return this.stop();
  }

  public pause(): void {
    if (this._dispatcher) this._dispatcher.pause();
    this.events.emit('pause');
  }

  public resume(): void {
    if (this._dispatcher) this._dispatcher.resume();
    this.events.emit('resume');
  }

  public async start(channel: VoiceChannel, options?: StreamOptions): Promise<void> {
    await Playlist.ensureVoiceConnection(channel);
    await this._start(options);
  }

  private async _start(options?: StreamOptions): Promise<void> {
    if (this._playing) this.stop();

    if (!this.current) {
      this.events.emit('error', new Error(Code.NO_CURRENT_SONG));
      return;
    }

    const stream = await this.current.stream();
    stream.once('error', (e) => {
      this._playing = false;
      this.events.emit('error', e);
      this._end();
    });

    if (!this.guild.voiceConnection) {
      this.events.emit('error', new Error(Code.NO_VOICE_CONNECTION));
      return;
    }

    const dispatcher = this.guild.voiceConnection.play(stream, options);
    this._playing = true;
    this.events.emit('playing');

    this._endListener = async () => {
      const next = await this.next();
      if (!next) return this._destroy();

      await this._start(options);
    };

    dispatcher.once('end', () => {
      if (!this._playing) return;

      this._playing = false;
      this.events.emit('ended');

      this._endListener();
    });
  }

  private _end(): void {
    if (this._dispatcher) this._dispatcher.end();
  }

  private _destroy(): void {
    if (this.guild.voiceConnection) this.guild.voiceConnection.disconnect();
    this.guild.playlist.reset();
    this.events.emit('destroyed');
  }
}
