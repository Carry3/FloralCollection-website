import * as migration_20260924_003838_initial from './20260924_003838_initial';

export const migrations = [
  {
    up: migration_20260924_003838_initial.up,
    down: migration_20260924_003838_initial.down,
    name: '20260924_003838_initial'
  },
];
