import postgres from 'postgres';
import fs from 'fs';
const env = Object.fromEntries(fs.readFileSync('.env','utf8')
  .split('\n').filter(l=>l.trim()&&!l.startsWith('#')&&l.includes('='))
  .map(l=>[l.slice(0,l.indexOf('=')).trim(), l.slice(l.indexOf('=')+1).trim()]));
const url = env.POSTGRES_URL;
console.log('POSTGRES_URL ->', url.replace(/\/\/.*?@/,'//***:***@'));
for (const ssl of ['require', false]) {
  try {
    const sql = postgres(url, { ssl, connect_timeout: 5 });
    const r = await sql`select current_database() as db, (select count(*)::int from customers) as customers`;
    console.log(`  ssl=${JSON.stringify(ssl)} -> OK  db=${r[0].db} customers=${r[0].customers}`);
    await sql.end();
  } catch (e) { console.log(`  ssl=${JSON.stringify(ssl)} -> FALLA: ${e.message}`); }
}
