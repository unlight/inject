const once = (fn) => ((first = true) => () => first ? (first = !first, fn = fn()) : fn)();
const dependencies = new Map<any, () => any>();

export interface ProvideInterface {
    (token: string, mock: () => any): void;
    (token: any, mock: any): void;
}

/**
 * Provide a dependency.
 * @param token The injection token
 * @param mock The mock object
 */
function provide(token: any, mock: any): void {
    dependencies.set(token, mock);
}

function clear() {
    dependencies.clear();
}

/**
 * Inject a dependency
 * @param token The injection token
 * @param factory Factory function that returns the dependency
 * @returns The dependency or a mock object if the dependency was mocked using mock()
 */
export function factory<T>(token: any, factory: () => T): T {
    if (!dependencies.has(token)) {
        return factory();
    }
    const getInstance = dependencies.get(token);
    return getInstance();
}

/**
 * Singleton
 */
export function service<T extends new (...args: any[]) => any>(ctor: T): InstanceType<T> {
    if (!dependencies.has(ctor)) {
        dependencies.set(ctor, once(() => new ctor()));
    }
    const getInstance = dependencies.get(ctor);
    return getInstance();
}

/**
 * Value
 */
export function value<T>(token: string | symbol, v: T): T {
    if (!dependencies.has(token)) {
        dependencies.set(token, () => v);
    }
    const getInstance = dependencies.get(token);
    return getInstance();
}

export const injector = {
    provide: provide as ProvideInterface,
    mock: provide as ProvideInterface,
    clear,
};

export const inject = factory as {
    <T>(token: any, factory: () => T): T;
    factory: typeof factory;
    service: typeof service;
    value: typeof value;
};

inject['factory'] = factory;
inject['service'] = service;
inject['value'] = value;
