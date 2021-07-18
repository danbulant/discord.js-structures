
const proxyHandlers = {};

/**
 * @type {ProxyHandler<import("discord.js")>}
 */
export const defaultProxy = {
    get(target, property, receiver) {
        if(property in proxyHandlers) return proxyHandlers[property];
        return Reflect.get(target, property, receiver);
    }
}