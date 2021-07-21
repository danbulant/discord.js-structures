const Structures = require("./structures.js");
const discord = require("discord.js");
const EventProxy = require("./eventProxy.js");

module.exports = {
    Client: class Client {
        constructor(...params) {
            var proxy = new EventProxy();
            return new Proxy(new Proxy(new discord.Client(...params), require("./client.js")), proxy.proxy);
        }
    },
    Structures: Structures
};