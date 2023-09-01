import { createPool } from 'mysql2/promise';

export const pool = createPool({
  host: 'loclhost',
  user: 'root',
  database: 'megak_arena',
  namedPlaceholders: true,
  decimalNumbers: true,
});
