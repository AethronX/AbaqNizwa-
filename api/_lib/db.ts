import { Pool, QueryResultRow } from 'pg';

// Supabase's Vercel integration exposes POSTGRES_URL (pooled, via Supavisor);
// other providers commonly use DATABASE_URL. Support both.
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  throw new Error(
    'No database connection string found. Set DATABASE_URL (or POSTGRES_URL) in your Vercel project env vars — added automatically when you connect a Postgres database from the Storage tab.'
  );
}

// Passing `connectionString` directly to pg lets its internal parser read
// `sslmode` from the URL and use that instead of our explicit `ssl` option,
// which silently re-enables strict certificate validation against hosted
// providers' self-signed pooler certs (e.g. Supabase's Supavisor). Parsing
// the string ourselves into discrete fields sidesteps that code path
// entirely, so the `ssl` option below is guaranteed to be what applies.
function parseConnectionString(cs: string) {
  const url = new URL(cs);
  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 5432,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
  };
}

const pool = new Pool({
  ...parseConnectionString(connectionString),
  ssl: { rejectUnauthorized: false },
  max: 1, // one connection per serverless invocation
});

function buildQuery(strings: TemplateStringsArray, values: unknown[]): string {
  let text = strings[0];
  for (let i = 0; i < values.length; i++) {
    text += `$${i + 1}` + strings[i + 1];
  }
  return text;
}

// Mimics the neon() tagged-template driver's contract used throughout the
// api/*.ts handlers: `await sql\`SELECT ...\`` resolves directly to the rows.
export async function sql<T extends QueryResultRow = any>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  const text = buildQuery(strings, values);
  const result = await pool.query<T>(text, values);
  return result.rows;
}

let schemaReady: Promise<void> | null = null;

// Idempotent, runs on first request per cold start — no manual migration step needed.
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          category TEXT NOT NULL,
          price NUMERIC(10,2) NOT NULL,
          in_stock BOOLEAN NOT NULL DEFAULT true,
          data JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products (category)`;

      await sql`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          order_number TEXT UNIQUE NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          total NUMERIC(10,2) NOT NULL,
          data JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at)`;

      await sql`
        CREATE TABLE IF NOT EXISTS coupons (
          id TEXT PRIMARY KEY,
          code TEXT UNIQUE NOT NULL,
          active BOOLEAN NOT NULL DEFAULT true,
          data JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS customers (
          id TEXT PRIMARY KEY,
          data JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS analytics_events (
          id BIGSERIAL PRIMARY KEY,
          event_type TEXT NOT NULL DEFAULT 'pageview',
          path TEXT,
          referrer TEXT,
          device_type TEXT,
          country TEXT,
          session_id TEXT,
          meta JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events (created_at)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_analytics_path ON analytics_events (path)`;
    })();
  }
  return schemaReady;
}
