import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { loadCommands } from './commands';
import { loadEvents } from './events';
import cors from 'cors';

// Load environment variables
config();

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Load commands and events
loadCommands(client);
loadEvents(client);

// Express app for HTTP endpoints
const app = express();
app.use(cors()); // Allow all origins for development

// Health check endpoint
app.get('/', (req, res) => res.send('Discord bot is running!'));

// API endpoint for user verification (by userId or username)
app.get('/api/verify', async (req, res) => {
  const { userId, username, guildId } = req.query;
  try {
    const guild = await client.guilds.fetch(guildId as string);
    let member;

    if (userId) {
      member = await guild.members.fetch(userId as string);
    } else if (username) {
      const members = await guild.members.fetch();
      member = members.find(
        m => m.user.username.toLowerCase() === (username as string).toLowerCase()
      );
    } else {
      return res.status(400).json({ error: 'Provide userId or username' });
    }

    if (member) {
      res.json({ exists: true, userId: member.user.id, username: member.user.username });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (e) {
    res.status(404).json({ exists: false });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Discord bot HTTP server running on port ${PORT}`);
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Login to Discord
client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    console.log('Bot is starting up...');
  })
  .catch((error) => {
    console.error('Error logging in:', error);
    process.exit(1);
  });
