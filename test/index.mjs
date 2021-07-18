import discord from "../index.mjs";
import config from "./config.json";

discord.Structures.extend('Message', Message => {
    class BetterMessage extends Message {
      constructor(client, data) {
        super(client, data);
        this.cool = true;
      }
    }
  
    return BetterMessage;
});

const client = new discord.Client();
client.login(config.token);

client.on("message", (msg) => {
    console.log(msg);
});