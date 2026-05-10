import * as migration_20260510_152707 from './20260510_152707';
import * as migration_20260510_153137 from './20260510_153137';
import * as migration_20260510_155006 from './20260510_155006';

export const migrations = [
  {
    up: migration_20260510_152707.up,
    down: migration_20260510_152707.down,
    name: '20260510_152707',
  },
  {
    up: migration_20260510_153137.up,
    down: migration_20260510_153137.down,
    name: '20260510_153137',
  },
  {
    up: migration_20260510_155006.up,
    down: migration_20260510_155006.down,
    name: '20260510_155006'
  },
];
