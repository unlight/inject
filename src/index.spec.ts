/* eslint-disable @typescript-eslint/tslint/config */
import { inject, injector } from '.';
import * as expect from 'expect';

afterEach(() => {
    injector.clear();
});

it('smoke test', () => {
    expect(inject).toBeTruthy();
});

it('provide number', () => {
    const result = inject('number', () => 1);
    expect(result).toEqual(1);
});

it('provide object', () => {
    const dep = { foo: 'be' };
    const result = inject('dep', () => dep);
    expect(result).toEqual(dep);
});

it('mock test', () => {
    injector.mock('id', () => 'foo');
    const result = inject('id', () => 'buz');
    expect(result).toEqual('foo');
});

it('clear', () => {
    injector.mock('foo', () => 'FOO');
    injector.clear();
    const result = inject('foo', () => '123');
    expect(result).toEqual('123');
});

it('inject service', () => {
    class Car {
        static count = 0;
        constructor() { Car.count++; }
    }
    let vehicle = inject.service(Car);
    vehicle = inject.service(Car);
    expect(vehicle).toBeA(Car);
    expect(Car.count).toEqual(1);
});

it('provide dependency', () => {
    class Cat { }
    injector.provide(Cat, () => new Cat());
    const cat = inject.service(Cat);
    expect(cat).toBeA(Cat);
});

it('inject value', () => {
    const test = inject.value('token', 'ZOOM');
    expect(test).toBe('ZOOM');
});
