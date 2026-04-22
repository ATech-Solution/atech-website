import * as migration_20260414_075832 from './20260414_075832';
import * as migration_20260414_080218 from './20260414_080218';
import * as migration_20260416_030629 from './20260416_030629';
import * as migration_20260416_040410 from './20260416_040410';
import * as migration_20260416_084534_convertnew from './20260416_084534_convertnew';
import * as migration_20260416_113040_convertnew1 from './20260416_113040_convertnew1';
import * as migration_20260417_180157_p1 from './20260417_180157_p1';
import * as migration_20260418_055503 from './20260418_055503';
import * as migration_20260419_035759 from './20260419_035759';
import * as migration_20260422_061100 from './20260422_061100';

export const migrations = [
  {
    up: migration_20260414_075832.up,
    down: migration_20260414_075832.down,
    name: '20260414_075832',
  },
  {
    up: migration_20260414_080218.up,
    down: migration_20260414_080218.down,
    name: '20260414_080218',
  },
  {
    up: migration_20260416_030629.up,
    down: migration_20260416_030629.down,
    name: '20260416_030629',
  },
  {
    up: migration_20260416_040410.up,
    down: migration_20260416_040410.down,
    name: '20260416_040410',
  },
  {
    up: migration_20260416_084534_convertnew.up,
    down: migration_20260416_084534_convertnew.down,
    name: '20260416_084534_convertnew',
  },
  {
    up: migration_20260416_113040_convertnew1.up,
    down: migration_20260416_113040_convertnew1.down,
    name: '20260416_113040_convertnew1',
  },
  {
    up: migration_20260417_180157_p1.up,
    down: migration_20260417_180157_p1.down,
    name: '20260417_180157_p1',
  },
  {
    up: migration_20260418_055503.up,
    down: migration_20260418_055503.down,
    name: '20260418_055503',
  },
  {
    up: migration_20260419_035759.up,
    down: migration_20260419_035759.down,
    name: '20260419_035759',
  },
  {
    up: migration_20260422_061100.up,
    down: migration_20260422_061100.down,
    name: '20260422_061100'
  },
];
