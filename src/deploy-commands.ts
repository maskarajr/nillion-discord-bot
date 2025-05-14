import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import role from './commands/role';
import help from './commands/help';

config();

const commands = [
  role.data.toJSON(),
  help.data.toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    console.log('Commands to register:', commands);

    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
    console.log('Registered commands:', data);
  } catch (error) {
    console.error('Error refreshing application commands:', error);
  }
})();
