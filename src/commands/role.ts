import { 
  CommandInteraction, 
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Role
} from 'discord.js';

const role = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Manage roles')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a role to a user')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('The user to add the role to')
            .setRequired(true))
        .addRoleOption(option =>
          option.setName('role')
            .setDescription('The role to add')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a role from a user')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('The user to remove the role from')
            .setRequired(true))
        .addRoleOption(option =>
          option.setName('role')
            .setDescription('The role to remove')
            .setRequired(true))),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.memberPermissions?.has('ManageRoles')) {
      return interaction.reply({
        content: 'You need the "Manage Roles" permission to use this command.',
        ephemeral: true
      });
    }

    const subcommand = interaction.options.getSubcommand();
    const user = interaction.options.getUser('user');
    const roleId = interaction.options.getRole('role')?.id;

    if (!user || !roleId) {
      return interaction.reply({
        content: 'Please provide both a user and a role.',
        ephemeral: true
      });
    }

    try {
      const member = await interaction.guild?.members.fetch(user.id);
      if (!member) {
        return interaction.reply({
          content: 'Could not find the specified user in this server.',
          ephemeral: true
        });
      }

      const targetRole = await interaction.guild?.roles.fetch(roleId);
      if (!targetRole) {
        return interaction.reply({
          content: 'Could not find the specified role in this server.',
          ephemeral: true
        });
      }

      if (subcommand === 'add') {
        await member.roles.add(targetRole);
        return interaction.reply({
          content: `Added role ${targetRole.name} to ${user.tag}`,
          ephemeral: true
        });
      } else {
        await member.roles.remove(targetRole);
        return interaction.reply({
          content: `Removed role ${targetRole.name} from ${user.tag}`,
          ephemeral: true
        });
      }
    } catch (error) {
      console.error('Error managing roles:', error);
      return interaction.reply({
        content: 'An error occurred while managing roles.',
        ephemeral: true
      });
    }
  }
};

export default role;
