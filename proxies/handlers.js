const Structures = require("./structures.js");
const discord = require("discord.js");
const Constants = require("discord.js/src/util/Constants");
const EventProxy = require("./eventProxy.js");
const cache = require("./cache");
const Message = require("./message.js");

function extend(obj, type) {
    if(cache.has(obj)) return cache.get(obj);
    var res;
    switch(type) {
        case "message":
            res = new Message(extend(obj.client), {
                ...obj,
                id: obj.id,
                type: Constants.MessageTypes.indexOf(obj.type),
                attachments: obj.attachments.values(),
                stickers: obj.stickers.values(),
                edited_timestamp: obj.editedTimestamp,
                reactions: obj.reactions.values(),
                mentions: obj.mentions.users,
                mention_roles: obj.mentions.roles,
                mention_everyone: obj.mentions.everyone,
                mention_channels: obj.mentions.crosspostedChannels,
                message_reference: {
                    channel_id: obj.reference.channelId,
                    guild_id: obj.reference.guildId,
                    message_id: obj.reference.messageId
                },
                interaction: {
                    id: obj.interaction.id,
                    user: extend(obj.interaction.user, "user"),
                    type: Constants.InteractionTypes.indexOf(obj.interaction.type),
                    name: obj.interaction.commandName
                }
            }, extend(obj.channel, "channel"));
            break;
    }
    if(res) cache.set(obj, res);
    return res || obj;
}

module.exports = {
    Client: class Client {
        constructor(...params) {
            var proxy = new EventProxy();
            proxy.setProxy("message", (msg) => {
                return extend(msg, "message");
            });
            const client = new discord.Client(...params);
            const prox = new Proxy(new Proxy(client, require("./client.js")), proxy.proxy);
            cache.set(client, prox);
            return prox;
        }
    },
    Structures: Structures
};