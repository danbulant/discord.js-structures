import discord from "discord.js";
import { defaultProxy } from "./proxies/index.mjs";
import Module from "module";

/** The proxied version, in case you like named params */
export const proxy = new Proxy(discord, defaultProxy);

/** The original discord.js, unmodified. Useful when using discord.js-structures hooked */
export const original = discord;

/**
 * Hooks discord.js-structures into discord.js require, which should fix errors in 3rd party libraries trying to use Structures.
 * Overwrites global require function
 * @see [StackOverflow source](https://stackoverflow.com/a/24602188/8404532)
 */
export function hook() {
    var origRequire = Module.prototype.require;
    var _require = function(context, path) {
        return origRequire.call(context, path);
    };

    Module.prototype.require = function(path) {
        if(path === "discord.js") {
            return proxy;
        }

        return _require(this, path);
    };
}

export default proxy;