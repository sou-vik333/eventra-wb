#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/408963c231013a2b7bee2a09d44e06c0c9bce2de83e713167d7ce3084ef0009f/contract';
import startContract from '../../snapshots/408963c231013a2b7bee2a09d44e06c0c9bce2de83e713167d7ce3084ef0009f/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ab7dd74404df39a3fd96d2c51d5ddfc1fc9ac40f77e83a416175589fd76c2e9d/contract';
import endContract from '../../snapshots/ab7dd74404df39a3fd96d2c51d5ddfc1fc9ac40f77e83a416175589fd76c2e9d/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'payment',
        column: col('razorpayOrderId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'payment',
        constraint: 'payment_razorpayOrderId_key',
        columns: ['razorpayOrderId'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
