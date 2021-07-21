const discord = require("discord.js");

module.exports = class Message {
    constructor(...data) {
        return new Proxy(new discord.Message(...data), {

        });
    }
}