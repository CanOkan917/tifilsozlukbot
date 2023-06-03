const logger = require('pino')();
const { Client, Interaction } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 * @returns 
 */
module.exports = async (client, interaction) => {
  if (!interaction.isAnySelectMenu() || interaction.customId != 'rolesellector') return;

  const role = interaction.guild.roles.cache.get(interaction.values[0]);
  if (role) {
    interaction.member.roles.add(role);
    interaction.reply({
        ephemeral: true,
        content: `${role} oldun`
    });
    return;
  } else {
    interaction.reply({
        ephemeral: true,
        content: `ney seçtiysen valla bilemiyom ne seçtiğini`
    });
  }
};