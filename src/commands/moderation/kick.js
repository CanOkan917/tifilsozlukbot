const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const logger = require('pino')();

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('target-user').value;
        const reason = interaction.options.get('reason')?.value || 'No reason provided';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply('`❌ That user doesn\'t exist in this server`');
            return;
        }
        if (targetUser.id == interaction.guild.ownerId) {
            await interaction.editReply('`❌ You can\'t kick that user because they\'re the server owner.`');
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;
        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply('`❌ You can\'t kick that user because they have the same/higher role than you.`');
            return;
        }
        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply('`❌ I can\'t kick that user because they have the same/higher role than me.`');
            return;
        }

        try {
            await targetUser.kick(`${reason} | By: ${interaction.user.tag}`);
            await interaction.editReply(`\`✅ User \`${targetUser}\`was kicked | Reason: ${reason}\``);
        } catch (error) {
            logger.error(error);
        }
    },

    name: 'kick',
    description: 'Kicks a member from the server.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'target-user',
            description: 'The user you want to kick.',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'The reason for kick.',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissonsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers]
};