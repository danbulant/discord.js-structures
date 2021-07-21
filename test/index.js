const discord = require("../index");
const config = require("./config.json");

discord.Structures.extend('Message', Message => {
    class BetterMessage extends Message {
        constructor(client, data) {
            super(client, data);
            this.cool = true;
        }
    }

    return BetterMessage;
});

const client = new discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});
client.login(config.token);

client.on("ready", () => {
    console.log("Ready as", client.user.tag);
})
client.on("message", (msg) => {
    console.log(msg);
});