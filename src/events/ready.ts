import { Client, ActivityType } from 'discord.js';

export async function ready(client: Client) {
  console.log(`Logged in as ${client.user?.tag}`);
  console.log(`Connected to ${client.guilds.cache.size} servers`);
  
  // Set bot status
  client.user?.setActivity('!help for commands', { type: ActivityType.Playing });
}
