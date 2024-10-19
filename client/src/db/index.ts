import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from './schema';
import { migrate } from '@/db/migrate';

const client = new PGlite("idb://transcript-seeker_pgdata");
const db = drizzle({ client, schema });

migrate();

export { db }