# inject
Inject a dependency (service locator pattern).

## USAGE
```ts
// app.ts
import { inject } from 'njct';
const fs = inject('fs', () => require('fs'));
fs.readFileSync('data.json');

// app.spec.ts
import { injector } from 'njct';
injector.mock('fs', () => ({ readFileSync: () => 'result of call of fs.readFileSync()' }));
```

```ts
class Car {
    static count = 0;
    constructor() { Car.count++; }
}
let vehicle = inject(Car);
vehicle = inject(Car);
expect(vehicle).toBeA(Car);
expect(Car.count).toEqual(1);
```

## CHANGELOG
See [CHANGELOG](CHANGELOG.md)
