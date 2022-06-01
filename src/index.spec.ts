import { inject, injector } from '.';
import expect from 'expect';

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
    constructor() {
      Car.count++;
    }
  }
  inject(Car);
  const vehicle = inject(Car);

  expect(vehicle).toBeInstanceOf(Car);
  expect(Car.count).toEqual(1);
});

it('provide dependency', () => {
  class Cat {}
  injector.provide(Cat, () => new Cat());
  const cat = inject(Cat);
  expect(cat).toBeInstanceOf(Cat);
});

it('inject value', () => {
  const test = inject('token', 'ZOOM');
  expect(test).toBe('ZOOM');
});

it('inject throws error if nothing provided', () => {
  expect(() => {
    inject('Cat');
  }).toThrow('Cannot resolve Cat dependency');
});
