const { Client, Message } = require('discord.js');
const Level = require('../../models/Level');
const config = require('../../../config.json');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const logger = require('pino')();
const cooldowns = new Set();

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */
module.exports = async (client, message) => {
    if (!message.inGuild() || message.author.bot) return;
    if (message.content.length > config.minPointsMessageLenght) {
        if (cooldowns.has(message.author.id)) return;

        const xpToGive = Math.floor(message.content.length * config.xpPerLenght);

        const query = {
            userId: message.author.id,
            guildId: message.guild.id
        };

        try {
            const level = await Level.findOne(query);

            if (level) {
                level.xp += xpToGive;
                if (level.xp > calculateLevelXp(level.level)) {
                    level.xp = 0;
                    level.level += 1;

                    message.channel.send(`${message.member}, Seviye atladın! Artık **${level.level}** seviyesin!`);
                }

                await level.save().catch((error) => {
                    logger.error(error);
                });
                cooldowns.add(message.author.id);
                setTimeout(() => {
                    cooldowns.delete(message.author.id);
                }, 60000);
            } else {
                const newLevel = new Level({
                    userId: message.author.id,
                    guildId: message.guild.id,
                    xp: xpToGive
                });

                await newLevel.save().catch((error) => {
                    logger.error(error);
                });
                cooldowns.add(message.author.id);
                setTimeout(() => {
                    cooldowns.delete(message.author.id);
                }, 60000);
            }
        } catch (error) {
            logger.error(error);
        }
    }
}