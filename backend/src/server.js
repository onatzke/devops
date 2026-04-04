const express = require('express');
const { randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Unikalny identyfikator tej instancji backendu
// Generowany przy starcie kontenera — pozwala rozróżnić instancje przy skalowaniu
const INSTANCE_ID = process.env.INSTANCE_ID || randomUUID().slice(0, 8);
const START_TIME = Date.now();

app.use(express.json());

// ─── In-memory store (w produkcji: baza danych) ───────────────────────────────
let items = [
    { id: 1, name: 'Laptop ThinkPad X1', price: 5499.00, category: 'Elektronika' },
    { id: 2, name: 'Klawiatura mechaniczna', price: 349.00, category: 'Peryferia' },
    { id: 3, name: 'Monitor 4K 27"', price: 1899.00, category: 'Elektronika' },
];
let nextId = 4;

// ─── GET /items ───────────────────────────────────────────────────────────────
app.get('/items', (req, res) => {
    res.json(items);
});

// ─── POST /items ──────────────────────────────────────────────────────────────
app.post('/items', (req, res) => {
    const { name, price, category } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Pole "name" jest wymagane.' });
    }

    if (price === undefined || typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: 'Pole "price" musi być liczbą >= 0.' });
    }

    const item = {
        id: nextId++,
        name: name.trim(),
        price,
        category: category?.trim() || null,
    };

    items.push(item);
    console.log(`[POST /items] Dodano: ${JSON.stringify(item)}`);
    res.status(201).json(item);
});

// ─── GET /stats ───────────────────────────────────────────────────────────────
// Ten endpoint jest cachowany przez Nginx na 30 sekund (proxy_cache_valid 200 30s).
// instanceId pozwala weryfikować, że Nginx zwraca cache zamiast odpytywać backend.
app.get('/stats', (req, res) => {
    const uptimeMs = Date.now() - START_TIME;
    res.json({
        totalProducts: items.length,
        instanceId: INSTANCE_ID,
        uptime: Math.floor(uptimeMs / 1000),
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
    });
});

// ─── GET /health ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({ status: 'ok', instanceId: INSTANCE_ID });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Backend [${INSTANCE_ID}] nasłuchuje na porcie ${PORT}`);
});