require('../dist');
const { Client } = require('discord.js');
const { YouTubeService } = require('cassette');

const client = new Client();
client.on('message', async m => {
  const added = await m.guild.playlist.add(m.content, [new YouTubeService(process.env.YOUTUBE)]);
  console.log(added);
  m.guild.playlist.start(m.member.voiceChannel);
});

client.login(process.env.TOKEN);
