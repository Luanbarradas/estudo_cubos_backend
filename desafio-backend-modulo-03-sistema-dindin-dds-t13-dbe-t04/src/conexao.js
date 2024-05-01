const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    database: 'dindin',
    password: '123456',
    // password: '123456789'
});

const query = async (query, params) => {
    return await pool.query(query, params)
}

module.exports = {
    pool,
    query
}