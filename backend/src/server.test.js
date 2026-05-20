const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('Walidacja nazwy produktu', () => {
    it('pusta nazwa jest nieprawidłowa', () => {
        const name = '';
        assert.equal(name.trim() === '', true);
    });

    it('nazwa z samych spacji jest nieprawidłowa', () => {
        const name = '   ';
        assert.equal(name.trim() === '', true);
    });

    it('poprawna nazwa przechodzi walidację', () => {
        const name = 'Laptop';
        assert.equal(name.trim() !== '', true);
    });
});

describe('Walidacja ceny produktu', () => {
    it('cena ujemna jest nieprawidłowa', () => {
        const price = -1;
        assert.equal(price < 0, true);
    });

    it('cena zero jest prawidłowa', () => {
        const price = 0;
        assert.equal(price >= 0, true);
    });

    it('cena dodatnia jest prawidłowa', () => {
        const price = 99.99;
        assert.equal(typeof price === 'number' && price >= 0, true);
    });
});


describe('Obliczenia na produktach', () => {
    it('średnia cena jest obliczana poprawnie', () => {
        const prices = [100, 200, 300];
        const avg = prices.reduce((s, p) => s + p, 0) / prices.length;
        assert.equal(avg, 200);
    });


    it('maksymalna cena jest wykrywana poprawnie', () => {
        const prices = [5, 99, 23, 1];
        const max = Math.max(...prices);
        assert.equal(max, 99);
    });
});