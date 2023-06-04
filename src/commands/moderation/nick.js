const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const logger = require('pino')();

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('kullanici').value;
        const isim = interaction.options.get('isim').value;

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply('`❌ Böyle bir kullanıcı yok`');
            return;
        }
        if (targetUser.id == interaction.guild.ownerId) {
            await interaction.editReply('`❌ Bu kullanıcının ismini değiştiremezsin çünkü sunucu sahibi`');
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;
        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply('`❌ Bu kullanıcının ismini değiştiremezsin çünkü seninle aynı veya daha yüksek bir rolü var`');
            return;
        }
        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply('`❌ Bu kullanıcının ismini değiştiremezsin çünkü benimle aynı veya daha yüksek bir rolü var`');
            return;
        }

        try {
            await targetUser.setNickname(isim);
            await interaction.editReply(`\`✅ \`${targetUser}\` adlı kullanıcının sunucudaki kullanıcı adı değiştirildi\``);
        } catch (error) {
            logger.error(error);
        }
    },

    name: 'nick',
    description: 'birinin sunucudaki kullanıcı adını değiştirir',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'kullanici',
            description: 'sunucudaki ismini değiştirmek istediğin kullanıcı',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'isim',
            description: 'yeni ismi',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissonsRequired: [PermissionFlagsBits.ChangeNickname],
    botPermissions: [PermissionFlagsBits.ChangeNickname]
};