/* eslint-disable no-redeclare */
// @ts-ignore
import isClass from 'node-is-class';
import { once } from '@zodash/once';

const dependencies = new Map<any, () => any>();

function provide(token: any, mock: () => any): void;
/**
 * Provide a dependency.
 * @param token The injection token
 * @param mock The mock object
 */
function provide(token: any, mock: any): void {
  dependencies.set(token, mock);
}

function provideClass(token: any, ctor: any) {
  dependencies.set(
    token,
    once(() => new ctor()),
  );
}

function clear() {
  dependencies.clear();
}

/**
 * Inject a dependency instance of a class
 * @param ctor Constructable class reference
 * @returns The instance of the class or a mock object if the dependency was mocked using mock()
 */
export function inject<T extends new (...arguments_: any[]) => any>(ctor: T): T;
/**
 * Inject a dependency of primitive value
 * @param token The injection token
 * @param value Primitive value
 * @returns The dependency or a mock value if the dependency was mocked using mock()
 */
export function inject<
  T extends string | number | boolean | symbol | bigint | null | undefined,
>(token: any, value: T): T;
/**
 * Inject a dependency
 * @param token The injection token
 * @param factory Factory function that returns the dependency
 * @returns The dependency or a mock object if the dependency was mocked using mock()
 */
export function inject<T>(token: any, factory?: () => T): T;

export function inject(): any {
  const { 0: token, 1: factory, length } = arguments;

  if (!dependencies.has(token)) {
    if (typeof factory === 'function') {
      return factory();
    }
    if (isClass(token)) {
      dependencies.set(
        token,
        once(() => new token()),
      );
    } else if (length === 1) {
      throw new Error(`Cannot resolve ${token} dependency`);
    }
    // Check if factory is primitive
    // eslint-disable-next-line unicorn/new-for-builtins
    else if (Object(factory) !== factory) {
      dependencies.set(token, () => factory);
    }
  }

  return dependencies.get(token)?.();
}

export const injector = {
  provideClass,
  provide: provide,
  clear,
};
