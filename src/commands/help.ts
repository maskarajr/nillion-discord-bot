import { 
  ChatInputCommandInteraction, 
  SlashCommandBuilder 
} from 'discord.js';

const help = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all available commands'),

  async execute(interaction: ChatInputCommandInteraction) {
    const commands = [
      { name: '/role add', description: 'Add a role to a user' },
      { name: '/role remove', description: 'Remove a role from a user' },
      { name: '/help', description: 'Show this help message' }
    ];

    const helpMessage = commands
      .map(cmd => `**${cmd.name}** - ${cmd.description}`)
      .join('\n');

    await interaction.reply({
      content: `Available commands:\n${helpMessage}`,
      ephemeral: true
    });
  }
};

export default help;
