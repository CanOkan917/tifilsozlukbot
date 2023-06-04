const { Client, Interaction, ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const canvacord = require('canvacord');
const Level = require('../../models/Level');
const calculateLevelXp = require("../../utils/calculateLevelXp");

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply('sadece sunucuda kullanabilirsin');
            return;
        }

        await interaction.deferReply();

        const mentionedUserId = interaction.options.get('kullanici')?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id
        });
        if (!fetchedLevel) {
            interaction.editReply(
                mentionedUserId ? `${targetUserObj}'in seviyesi yok! seviye kazanmak için biraz daha çaba göstermesi gerekiyor.`
                : `daha seviyen yok! seviye kazanmak için biraz daha çaba göstermen gerekiyor.`
            );
            return;
        }

        let allLevels = await Level.find({ guildId: interaction.guild.id }).select('-_id userId level xp');
        allLevels.sort((a, b) => {
            if (a.level == b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        });
        let currentRank = allLevels.findIndex((lvl) => lvl.userId == targetUserId) + 1;

        const rank = new canvacord.Rank()
            .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
            .setRank(currentRank)
            .setLevel(fetchedLevel.level)
            .setCurrentXP(fetchedLevel.xp)
            .setRequiredXP(calculateLevelXp(fetchedLevel.level))
            .setStatus(targetUserObj.presence.status)
            .setProgressBar('#00fdfd', 'COLOR')
            .setUsername(targetUserObj.user.username)
            .setDiscriminator(targetUserObj.user.discriminator);
        const data = await rank.build();
        const attachment = new AttachmentBuilder(data);
        interaction.editReply({files: [attachment] });
    },
    name: 'level',
    description: 'senin veya başkasının seviyesini gösterir',
    options: [
        {
            name: 'kullanici',
            description: 'seviyesini görmek istediğin kullanıcı',
            type: ApplicationCommandOptionType.Mentionable,
        }
    ]
};