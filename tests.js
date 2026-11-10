// Quick checks for Part A. Run with: node tests.js
const d = require("./deals.js");
const assert = require("assert");

const byTitle = (t) => d.games.find((g) => g.title === t);

// Filter
assert.strictEqual(d.getOnSale(d.games).length, 6);
assert.deepStrictEqual(
  d.getOnSale(d.games).map((g) => g.title),
  ["Hollow Knight", "Celeste", "Hades", "Portal 2", "Disco Elysium", "Cuphead"]
);

// Discount percentage
assert.strictEqual(d.discountPercent(byTitle("Hollow Knight")), 50);
assert.strictEqual(d.discountPercent(byTitle("Celeste")), 75);
assert.strictEqual(d.discountPercent(byTitle("Portal 2")), 90);
assert.strictEqual(d.discountPercent(byTitle("Disco Elysium")), 75);
assert.strictEqual(d.discountPercent(byTitle("Cuphead")), 25);
assert.strictEqual(d.discountPercent(byTitle("Terraria")), 0); // not on sale

// Cheapest
assert.strictEqual(d.cheapestGame(d.games).title, "Portal 2");
assert.strictEqual(d.cheapestGame([]), null);

// Search
assert.strictEqual(d.searchByTitle(d.games, "HADES").length, 1);
assert.strictEqual(d.searchByTitle(d.games, "  cel ").length, 1);
assert.strictEqual(d.searchByTitle(d.games, "").length, 8);
assert.strictEqual(d.searchByTitle(d.games, "zzz").length, 0);

console.log("All checks passed");
