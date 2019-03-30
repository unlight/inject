// https://github.com/1-liners/1-liners/blob/master/module/once.js
const once = (fn) => ((first = true) => () => first ? (first = !first, fn = fn()) : fn)();

const dependencies = new Map();

function provide(token: new(...args: any[]) => any): void;
function provide(token: any, mock: () => any): void;
/**
 * Provide a dependency.
 * @param token The injection token
 * @param mock The mock object
 */
function provide(token: any, mock?: () => any): void {
    dependencies.set(token, mock);
}

function clear() {
    dependencies.clear();
}

export function inject<T extends new (...args: any[]) => any>(ctor: T): InstanceType<T>;
export function inject<T>(token: string, factory: () => T): T;
/**
 * Inject a dependency
 * @param token The injection token
 * @param factory Factory function that returns the dependency
 * @returns The dependency or a mock object if the dependency was mocked using mock()
 */
export function inject<T>(token: any, factory?: () => T): T {
    const dependency = dependencies.get(token);
    if (dependency) {
        return dependency();
    }
    if (factory === undefined) {
        dependencies.set(token, once(() => new token()));
        return inject(token);
    }
    return factory();
}

/**
 * Singleton
 */
export function service<T extends new (...args: any[]) => any>(ctor: T): InstanceType<T> {
    if (dependencies.has(ctor)) {
        return dependencies.get(ctor);
    }
    const result = new ctor();
    dependencies.set(ctor, result);
    return result;
}

export function factory(fn, ...args: any[]) {
    if (dependencies.has(fn)) {
        return dependencies.get(fn);
    }
    const result = fn(...args);
    dependencies.set(fn, result);
    return result;
}

export function value(token: string | symbol, v: any) {
    if (dependencies.has(token)) {
        return dependencies.get(token);
    }
    dependencies.set(token, v);
    return v;
}

export const injector = {
    provide,
    mock: provide,
    clear,
};
