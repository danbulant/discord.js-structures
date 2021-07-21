
/**
 * @type {ProxyHandler<import("discord.js").Client>}
 */
module.exports = {
    get(target, property, receiver) {
        return Reflect.get(target, property, receiver);
    }
}