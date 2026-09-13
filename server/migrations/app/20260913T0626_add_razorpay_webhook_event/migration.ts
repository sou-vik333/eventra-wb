#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/ab7dd74404df39a3fd96d2c51d5ddfc1fc9ac40f77e83a416175589fd76c2e9d/contract';
import startContract from '../../snapshots/ab7dd74404df39a3fd96d2c51d5ddfc1fc9ac40f77e83a416175589fd76c2e9d/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/c838b6a81e2f60086219250e246d253cd95951d62d5c33e1917704166fec5df5/contract';
import endContract from '../../snapshots/c838b6a81e2f60086219250e246d253cd95951d62d5c33e1917704166fec5df5/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'razorpayWebhookEvent',
        columns: [
          col('event', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('eventId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('processedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'razorpayWebhookEvent',
        constraint: 'razorpayWebhookEvent_eventId_key',
        columns: ['eventId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'razorpayWebhookEvent',
        index: 'razorpayWebhookEvent_event_idx_0e2c7e2f',
        columns: ['event'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'razorpayWebhookEvent',
        index: 'razorpayWebhookEvent_processedAt_idx_e83f4a54',
        columns: ['processedAt'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
