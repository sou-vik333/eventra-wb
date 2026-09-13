#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/b1099f120e8e50ddda7e6d4638ea884997a5a6fd29a663967d39f7378440c448/contract';
import endContract from '../../snapshots/b1099f120e8e50ddda7e6d4638ea884997a5a6fd29a663967d39f7378440c448/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/c838b6a81e2f60086219250e246d253cd95951d62d5c33e1917704166fec5df5/contract';
import startContract from '../../snapshots/c838b6a81e2f60086219250e246d253cd95951d62d5c33e1917704166fec5df5/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'razorpayWebhookEvent',
        column: col('status', 'text', {
          notNull: true,
          default: lit('RECEIVED'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'razorpayWebhookEvent',
        constraint: 'razorpayWebhookEvent_status_check_9eba03e5',
        expression: "\"status\" IN ('RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED')",
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
