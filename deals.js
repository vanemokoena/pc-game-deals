// Part A —  functions for game deals.


const games = [
  { id: 1, title: "Hollow Knight", normalPrice: 14.99, salePrice: 7.49, store: "Steam" },
  { id: 2, title: "Stardew Valley", normalPrice: 13.99, salePrice: 13.99, store: "GOG" },
  { id: 3, title: "Celeste", normalPrice: 19.99, salePrice: 4.99, store: "Steam" },
  { id: 4, title: "Hades", normalPrice: 24.99, salePrice: 12.49, store: "Epic Games" },
  { id: 5, title: "Portal 2", normalPrice: 9.99, salePrice: 0.99, store: "Steam" },
  { id: 6, title: "Terraria", normalPrice: 9.99, salePrice: 9.99, store: "GOG" },
  { id: 7, title: "Disco Elysium", normalPrice: 39.99, salePrice: 9.99, store: "GOG" },
  { id: 8, title: "Cuphead", normalPrice: 19.99, salePrice: 14.99, store: "Steam" },
];

// A game is on sale when its sale price is lower than its normal price.
function isOnSale(game) {
  return game.salePrice < game.normalPrice;
}

//num 1. Filter: only the games that are on sale.
function getOnSale(list) {
  return list.filter(isOnSale);
}

// number 2. Discount percentage, rounded to a whole number.
//    Returns 0 for games not on sale (or a zero/invalid normal price).
function discountPercent(game) {
  if (!isOnSale(game) || game.normalPrice <= 0) return 0;
  return Math.round(((game.normalPrice - game.salePrice) / game.normalPrice) * 100);
}

// numbner 3. Cheapest game by sale price (what you actually pay).
//    Returns null for an empty list. Ties: the first one in the list wins.
function cheapestGame(list) {
  if (list.length === 0) return null;
  return list.reduce((cheapest, game) =>
    game.salePrice < cheapest.salePrice ? game : cheapest
  );
}

// number 4. Case-insensitive title search. Blank query returns everything.
function searchByTitle(list, query) {
  const q = String(query ?? "").trim().toLowerCase();
  if (q === "") return list;
  return list.filter((game) => game.title.toLowerCase().includes(q));
}

// allows the same file work in the browser and in Node 
if (typeof module !== "undefined") {
  module.exports = { games, isOnSale, getOnSale, discountPercent, cheapestGame, searchByTitle };
}
