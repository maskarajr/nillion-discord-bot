import { Client } from 'discord.js';
import { ready } from './ready';

export async function loadEvents(client: Client) {
  client.on('ready', ready);
  
  client.on('error', error => {
    console.error('Discord client error:', error);
  });

  client.on('warn', warning => {
    console.warn('Discord client warning:', warning);
  });
}
