require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require("./handlers/eventHandler");
const logger = require('pino')();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
    ]
});

(async () => {
    eventHandler(client);
    client.login(process.env.BOT_TOKEN);

    mongoose.set('strictQuery', false);
    await mongoose.connect(
        process.env.MONGODB_URI
    ).then(() => {
        logger.info('successfully connected to mongodb cloud server');
    }).catch((err) => {
        logger.error(err);
    });
})();