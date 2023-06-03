const { testServer } = require('../../../config.json');
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const logger = require('pino')();

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(
            client,
            testServer
        );

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommand = await applicationCommands.cache.find(
                (cmd) => cmd.name === name
            );

            if (existingCommand) {
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    logger.info(`Deleted command '${name}'`);
                    continue;
                }

                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options,
                    });

                    logger.info(`🔁 Edited command "${name}".`);
                }
            } else {
                if (localCommand.deleted) {
                    logger.info(
                        `⏩ Skipping registering command "${name}" as it's set to delete.`
                    );
                    continue;
                }

                await applicationCommands.create({
                    name,
                    description,
                    options,
                });

                logger.info(`👍 Registered command "${name}."`);
            }
        }
    } catch (error) {
        logger.error(error);
    }
};