const { Interaction, Client, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');


module.exports = {
    name: 'role',
    description: 'role',
    devOnly: true,

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const select = new StringSelectMenuBuilder()
            .setCustomId('rolesellector')
            .setPlaceholder('Sınıf seviyeni seç')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('5. Sınıf')
                    .setDescription('5. Sınıftaysan seç')
                    .setValue('1113926811072610336'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('6. Sınıf')
                    .setDescription('6. Sınıftaysan seç')
                    .setValue('1113926778109579384'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('7. Sınıf')
                    .setDescription('7. Sınıftaysan seç')
                    .setValue('1113926106978979952'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('8. Sınıf')
                    .setDescription('8. Sınıftaysan seç')
                    .setValue('1113926166445834321'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('9. Sınıf')
                    .setDescription('9. Sınıftaysan seç')
                    .setValue('1113924891306111077'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('10. Sınıf')
                    .setDescription('10. Sınıftaysan seç')
                    .setValue('1113926586169823316'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('11. Sınıf')
                    .setDescription('11. Sınıftaysan seç')
                    .setValue('1113926630210019368'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('12. Sınıf')
                    .setDescription('12. Sınıftaysan seç')
                    .setValue('1113926667455430808'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Mezun')
                    .setDescription('Mezunsan seç')
                    .setValue('1113926227498106902'),
            );
        const row = new ActionRowBuilder().addComponents(select);

        await interaction.reply({
            content: 'gönderdim!',
            ephemeral: true
        });
        await interaction.channel.send({components: [row]});
    }
};