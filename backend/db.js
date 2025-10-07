const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fullfire',
  password: 'Rezendeev!l123',
  port: 5432,
});

module.exports = pool;