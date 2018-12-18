import once = require('lodash.once');

const dependencies = new Map();

function provide(token: NewableFunction): void;
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
        factory = once(() => new token());
        dependencies.set(token, factory);
    }
    return factory();
}

export const injector = {
    provide,
    mock: provide,
    clear,
};
