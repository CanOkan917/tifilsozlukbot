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
        const reason = interaction.options.get('reason')?.value || 'Herhangi bir neden belirtilmedi';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply('`❌ Böyle bir kullanıcı yok`');
            return;
        }
        if (targetUser.id == interaction.guild.ownerId) {
            await interaction.editReply('`❌ Bu kullanıcıyı atamazsın çünkü sunucu sahibi`');
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;
        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply('`❌ Bu kullanıcıyı atamazsın çünkü seninle aynı veya daha yüksek bir rolü var`');
            return;
        }
        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply('`❌ Bu kullanıcıyı banlayamam çünkü benimle aynı veya daha yüksek bir rolü var`');
            return;
        }

        try {
            await targetUser.kick(`${reason} | ${interaction.user.tag} tarafından`);
            await interaction.editReply(`\`✅ \`${targetUser}\` atıldı | Neden: ${reason}\``);
        } catch (error) {
            logger.error(error);
        }
    },

    name: 'kick',
    description: 'birini sunucudan atar',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'target-user',
            description: 'atmak istediğin kişi',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'neden atmak istiyon',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissonsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers]
};