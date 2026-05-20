const express = require('express');
const { randomUUID } = require('crypto');
const { Pool } = require('pg');
const { createClient } = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;
const INSTANCE_ID = process.env.INSTANCE_ID || randomUUID().slice(0, 8);
const START_TIME = Date.now();

app.use(express.json());

// PostgreSQL
const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'db',
    database: process.env.POSTGRES_DB || 'products',
    user: process.env.POSTGRES_USER || 'products',
    password: process.env.POSTGRES_PASSWORD || 'secret123',
    port: 5432,
});

//Redis
const redisClient = createClient({
    socket: { host: process.env.REDIS_HOST || 'cache', port: 6379 }
});

let cacheHits = 0;

async function initDb() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
            id    SERIAL PRIMARY KEY,
            name  TEXT NOT NULL,
            price NUMERIC(10,2) NOT NULL DEFAULT 0
        )
    `);
    const { rows } = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(rows[0].count) === 0) {
        await pool.query(`
            INSERT INTO products (name, price) VALUES
            ('Laptop ThinkPad X1', 5499.00),
            ('Klawiatura mechaniczna', 349.00),
            ('Monitor 4K 27"', 1899.00)
        `);
        console.log('[db] Dodano domyślne produkty');
    }
    console.log('[db] Baza gotowa');
}


app.get('/items', async (req, res) => {
    try {
        const cached = await redisClient.get('items');
        if (cached) {
            cacheHits++;
            console.log('[cache] HIT')
            return res.json(JSON.parse(cached));
        }
        console.log('[cache] MISS — pobieram z bazy');
        const { rows } = await pool.query('SELECT * FROM products ORDER BY id');
        await redisClient.setEx('items', 30, JSON.stringify(rows));
        res.json(rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});


app.post('/items', async (req, res) => {
    const { name, price } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Pole "name" jest wymagane.' });
    }
    if (price === undefined || typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: 'Pole "price" musi być liczbą >= 0.' });
    }
    try {
        const { rows } = await pool.query(
            'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *',
            [name.trim(), price]
        );
        await redisClient.del('items');
        console.log('[cache] Unieważniono cache po POST');
        res.status(201).json(rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// ─── GET /stats ───────────────────────────────────────────────────────────────
app.get('/stats', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT COUNT(*) FROM products');
        res.json({
            totalProducts: parseInt(rows[0].count),
            cacheHits,
            instanceId: INSTANCE_ID,
            uptime: Math.floor((Date.now() - START_TIME) / 1000),
            timestamp: new Date().toISOString(),
            nodeVersion: process.version,
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


app.get('/health', (req, res) => {
    res.json({ status: 'nie ok', instanceId: INSTANCE_ID });
});


async function start() {
    await redisClient.connect();
    console.log('[redis] Połączono');
    await initDb();
    app.listen(PORT, () => {
        console.log(`Backend [${INSTANCE_ID}] nasłuchuje na porcie ${PORT}`);
    });
}

start().catch(err => {
    console.error('Błąd startu:', err);
    process.exit(1);
});