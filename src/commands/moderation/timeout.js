const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const logger = require('pino')();
const ms = require('ms');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const mentionable = interaction.options.get('target-user').value;
        const duration = interaction.options.get('duration').value;
        const reason = interaction.options.get('reason')?.value || 'Herhangi bir neden belirtilmedi';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(mentionable);

        if (!targetUser) {
            await interaction.editReply('`❌ Böyle bir kullanıcı yok`');
            return;
        }
        if (targetUser.user.bot) {
            await interaction.editReply('`❌ meslektaşlarımı zaman aşımına uğratmıcam 😡`');
            return;
        }

        const msDuration = ms(duration);
        if (isNaN(msDuration)) {
            await interaction.editReply('`❌ Lütfen geçerli bir süre gir (10s 10m 10h 10d)`');
            return;
        }
        if (msDuration < 5000 || msDuration > 2.419e9) {
            await interaction.editReply('`❌ zaman aşımı 5 saniyeden az 28 günden fazla olamaz`');
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;
        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply('`❌ Bu kullanıcıyı zaman aşımına uğratamazsın çünkü seninle aynı veya daha yüksek bir rolü var`');
            return;
        }
        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply('`❌ Bu kullanıcıyı zaman aşımına uğratamam çünkü benimle aynı veya daha yüksek bir rolü var`');
            return;
        }

        try {
            const { default: prettyMs } = await import('pretty-ms');

            if (targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration, `${reason} | By: ${interaction.user.tag}`);
                await interaction.editReply(`\`✅ \`${targetUser}\`'in zaman aşımı ${prettyMs(msDuration, { verbose: true })} olarak değiştirildi | Neden: ${reason}\``);
                return; 
            }
            await targetUser.timeout(msDuration, `${reason} | By: ${interaction.user.tag}`);
            await interaction.editReply(`\`✅ \`${targetUser}\`'in zaman aşımı ${prettyMs(msDuration, { verbose: true })} olarak eklendi | Neden: ${reason}\``);
        } catch (error) {
            logger.error(error);
        }
    },
    name: 'timeout',
    description: 'zaman aşımı gönder',
    options: [
        {
            name: 'target-user',
            description: 'zaman aşımına uğratmak istediğin kişi',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'duration',
            description: 'süre (30m, 1h, 1d).',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'reason',
            description: 'neden',
            type: ApplicationCommandOptionType.String,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers]
}