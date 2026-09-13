#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/ab7dd74404df39a3fd96d2c51d5ddfc1fc9ac40f77e83a416175589fd76c2e9d/contract';
import startContract from '../../snapshots/ab7dd74404df39a3fd96d2c51d5ddfc1fc9ac40f77e83a416175589fd76c2e9d/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/b1099f120e8e50ddda7e6d4638ea884997a5a6fd29a663967d39f7378440c448/contract';
import endContract from '../../snapshots/b1099f120e8e50ddda7e6d4638ea884997a5a6fd29a663967d39f7378440c448/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

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
          col('status', 'text', {
            notNull: true,
            default: lit('RECEIVED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'razorpayWebhookEvent_status_check_9eba03e5',
            "\"status\" IN ('RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED')",
          ),
        ],
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
      this.createIndex({
        schema: 'public',
        table: 'razorpayWebhookEvent',
        index: 'razorpayWebhookEvent_status_idx_e98638ab',
        columns: ['status'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
