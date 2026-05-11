import * as migration_20260510_152707 from './20260510_152707';
import * as migration_20260510_153137 from './20260510_153137';
import * as migration_20260510_155006 from './20260510_155006';
import * as migration_20260511_173531 from './20260511_173531';
import * as migration_20260511_182758 from './20260511_182758';

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
    name: '20260510_155006',
  },
  {
    up: migration_20260511_173531.up,
    down: migration_20260511_173531.down,
    name: '20260511_173531',
  },
  {
    up: migration_20260511_182758.up,
    down: migration_20260511_182758.down,
    name: '20260511_182758'
  },
];
