import { PGlite } from '@electric-sql/pglite';
import { vector } from '@electric-sql/pglite/vector';
import { drizzle } from 'drizzle-orm/pglite';

import { migrate } from './migrate';
import * as schema from './schema';

const client = new PGlite('idb://transcript-seeker_pgdata', {
  extensions: { vector },
});
const db = drizzle({ client, schema, casing: 'snake_case' });

migrate();

export { db };
