import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from './schema';

const client = new PGlite("idb://transcript-seeker_pgdata");
const db = drizzle({ client, schema });

export { db }