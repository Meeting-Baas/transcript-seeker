import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

import { migrate } from './migrate';
import * as schema from './schema';

const client = new PGlite('idb://transcript-seeker_pgdata');
const db = drizzle({ client, schema, casing: 'snake_case' });

migrate();

export { db };
