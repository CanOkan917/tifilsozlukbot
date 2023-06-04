const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const logger = require('pino')();
const { Client } = require('discord.js');

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        client.guilds.cache.forEach(async (guild) => {
            const applicationCommands = await getApplicationCommands(
                client,
                guild.id
            );
    
            for (const localCommand of localCommands) {
                const { name, description, options } = localCommand;
    
                const existingCommand = await applicationCommands.cache.find(
                    (cmd) => cmd.name === name
                );
    
                if (existingCommand) {
                    if (localCommand.deleted) {
                        await applicationCommands.delete(existingCommand.id);
                        logger.info(`Deleted command '${name}' for guild '${guild.name}'`);
                        continue;
                    }
    
                    if (areCommandsDifferent(existingCommand, localCommand)) {
                        await applicationCommands.edit(existingCommand.id, {
                            description,
                            options,
                        });
    
                        logger.info(`🔁 Edited command "${name}" for guild '${guild.name}'`);
                    }
                } else {
                    if (localCommand.deleted) {
                        logger.info(
                            `⏩ Skipping registering command "${name}" for guild '${guild.name}' as it's set to delete. `
                        );
                        continue;
                    }
    
                    await applicationCommands.create({
                        name,
                        description,
                        options,
                    });
    
                    logger.info(`👍 Registered command "${name}" for guild '${guild.name}'`);
                }
            }
        });
    } catch (error) {
        logger.error(error);
    }
};