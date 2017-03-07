import { inject, injector } from './index';
import assert = require('assert');

it('smoke test', () => {
    assert(inject);
});

it('provide number', () => {
    let result = inject('number', () => 1);
    assert(result === 1);
});

it('provide object', () => {
    let dep = { foo: 'be' };
    let result = inject('dep', () => dep);
    assert(result === dep);
});

it('mock test', () => {
    injector.mock('id', () => 'foo');
    let result = inject('id', () => 'buz');
    assert(result === 'foo');
});

it('clear', () => {
    injector.mock('foo', () => 'FOO');
    injector.clear();
    let result = inject('foo', () => '123');
    assert(result === '123');
});