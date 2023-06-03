const logger = require('pino')();

module.exports = (client) => {
    logger.info(`${client.user.tag} is online!`);
};