#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/726415c2f06b1d4919ca196d3f9bc2e3bd9fc70b9b4f5806cefdc6daef2b5bfb/contract';
import endContract from '../../snapshots/726415c2f06b1d4919ca196d3f9bc2e3bd9fc70b9b4f5806cefdc6daef2b5bfb/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/a55022cbb2d729400561ba49319ede21190fed90c25ddd6b240127d736b9e9d9/contract';
import startContract from '../../snapshots/a55022cbb2d729400561ba49319ede21190fed90c25ddd6b240127d736b9e9d9/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'User',
        constraint: 'User_role_check_482f18a5',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'User',
        constraint: 'User_role_check_3a951b66',
        expression: `"role" IN ('STUDENT', 'MENTOR')`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
