
module.exports = class EventProxy {
    proxies = new Map();
    once = new Map();
    on = new Map();
    targetEvents = new WeakMap();
    handlers = new Map();

    setProxy(event, handler) {
        this.proxies.set(event, handler);
    }
    
    handleEvent(event, args) {
        if(proxies.has(event)) {
            args = proxies.get(event)(...args);
        }
        for(const handler of (proxy.on.get(event) || [])) {
            handler(...args);
        }
        for(const handler of (proxy.once.get(event) || [])) {
            handler(...args);
        }
        proxy.once.delete(event);
    }

    get proxy() {
        const proxy = this;
        /** @type {ProxyHandler} */
        const handler = {
            get(target, property) {
                const events = proxy.targetEvents.get(target) || [];
                switch(property) {
                    case "on":
                        return (event, handler) => {
                            const handlers = proxy.on.get(event) || [];
                            handlers.push(handler);
                            proxy.on.set(event, handlers);
                            if(!events.includes(event)) {
                                const handler = (...args) => proxy.handleEvent(event, args);
                                proxy.handlers.set(event, handler);
                                target.on(event, handler);
                            }
                        }
                    case "once":
                        return (event, handler) => {
                            const handlers = proxy.once.get(event) || [];
                            handlers.push(handler);
                            proxy.once.set(event, handlers);
                            if(!events.includes(event)) {
                                const handler = (...args) => proxy.handleEvent(event, args);
                                proxy.handlers.set(event, handler);
                                target.on(event, handler);
                            }
                        }
                    case "off":
                        return (event, handler) => {
                            const handlers = proxy.on.get(event) || [];
                            if(handlers.includes(handler)) handlers.splice(handlers.indexOf(handler), 1);
                            if(handlers.length) {
                                proxy.on.set(event, handlers);
                            } else {
                                proxy.on.delete(event);
                            }
                            const handlers2 = proxy.once.get(event) || [];
                            if(handlers2.includes(handler)) handlers.splice(handlers.indexOf(handler), 1);
                            if(handlers2.length) {
                                proxy.once.set(event, handlers2);
                            } else {
                                proxy.once.delete(event);
                            }
                            if(!handlers.length && !handlers2.length) {
                                target.off(event, proxy.handlers.get(event));
                            }
                        }
                }
                return Reflect.get(...arguments);
            }
        }
        return handler;
    }
}