import { createDatabase } from 'db0';
import sqlite from 'db0/connectors/better-sqlite3';
import { drizzle } from 'db0/integrations/drizzle';

import * as schema from './schema';

const client = createDatabase(sqlite({}));
export const db = drizzle({ client, schema });
