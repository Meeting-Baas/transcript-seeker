import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

const client = new PGlite("idb://transcript-seeker_pgdata");
const db = drizzle({ client });

export { db }