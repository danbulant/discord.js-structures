const discord = require("discord.js");
const proxyHandlers = require("./proxies/handlers");
const Module = require("module");
const StructuresDef = require("./proxies/structures.js");

const original = discord;
const Structures = StructuresDef;

const proxy = new Proxy(discord, {
    get(target, property, receiver) {
        if(property in proxyHandlers) return proxyHandlers[property];
        if(property === "original") return original;
        if(property === "Structures") return Structures;
        if(property === "hook") return hook;
        return Reflect.get(target, property, receiver);
    }
});


/**
 * Hooks discord.js-structures into discord.js require, which should fix errors in 3rd party libraries trying to use Structures.
 * Overwrites global require function
 * @see [StackOverflow source](https://stackoverflow.com/a/24602188/8404532)
 */
function hook() {
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

module.exports = proxy;