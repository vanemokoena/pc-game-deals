// Parts B & C — render the deals, with live search, an on-sale filter,
// a store filter, sorting, and an optional button that loads real data
// from the CheapShark API.
// Uses the pure functions from deals.js (loaded first in index.html).

const dealsEl = document.getElementById("deals");
const summaryEl = document.getElementById("summary");
const searchEl = document.getElementById("search");
const onlySaleEl = document.getElementById("only-sale");
const sortEl = document.getElementById("sort");
const loadLiveEl = document.getElementById("load-live");
const sourceNoteEl = document.getElementById("source-note");
const storeListEl = document.getElementById("store-list");
const statCountEl = document.getElementById("stat-count");
const statBestEl = document.getElementById("stat-best");
const statCheapestEl = document.getElementById("stat-cheapest");
const navTabs = document.querySelectorAll(".nav-tab");
const sidebarEl = document.getElementById("sidebar");
const menuToggleEl = document.getElementById("menu-toggle");
const backdropEl = document.getElementById("backdrop");

let currentGames = games;   // starts as the local sample data
let currencySymbol = "R";   // sample data is Rand; CheapShark data is US dollars
let activeStore = "All";    // sidebar store filter



function formatPrice(value) {
  return currencySymbol + value.toFixed(2);
}

// Give each cover a stable pink/orange gradient based on the title.
const COVER_GRADIENTS = [
  ["#ff9ec4", "#ffc2da"],
  ["#ffb3d1", "#ff8fbb"],
  ["#ff85b3", "#ffb0cf"],
  ["#ffa6c9", "#ff7eb3"],
  ["#ff8fbb", "#ffcadf"],
];
//images 
const gameImages = {
  "Disco Elysium": "images/discoelysium.jpg",
  "Terraria": "images/terraria.jpg",
  "Portal 2": "images/portal2.jpg",
  "Hades": "images/hades.jpg",
  "Celeste": "images/celeste.jpg",
  "Hollow Knight": "images/hollowknight.jpg",
  "Cuphead": "images/cuphead.jpg",
  "Stardew Valley": "images/stardewvalley.jpg"
};
function coverFor(title) {
  let hash = 0;
  for (const ch of title) hash = (hash * 31 + ch.charCodeAt(0)) % 1000;
  const [a, b] = COVER_GRADIENTS[hash % COVER_GRADIENTS.length];
  return "linear-gradient(135deg, " + a + ", " + b + ")";
}

function buildCard(game, index) {
  const li = document.createElement("li");
  li.className = "deal";
  li.style.setProperty("--i", Math.min(index, 10)); // caps the stagger delay

  const cover = document.createElement("div");
  cover.className = "cover";
  const img = gameImages[game.title];
if (img) {
  cover.style.background = 'url("' + img + '") center / cover no-repeat';
} else {
  cover.textContent = game.title.trim().charAt(0).toUpperCase(); // fallback letter
}

  const body = document.createElement("div");
  body.className = "deal-body";

  const title = document.createElement("h2");
  title.textContent = game.title;
  const store = document.createElement("p");
  store.className = "store";
  store.textContent = game.store;

  const prices = document.createElement("div");
  prices.className = "prices";

  // The tag, discount and struck-through normal price appear ONLY for sale games.
  if (isOnSale(game)) {
    li.classList.add("on-sale");

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = "ON SALE";
    cover.append(tag);

    const discount = document.createElement("span");
    discount.className = "discount";
    discount.textContent = "-" + discountPercent(game) + "%";

    const was = document.createElement("s");
    was.className = "was";
    was.textContent = formatPrice(game.normalPrice);

    prices.append(discount, was);
  }

  const price = document.createElement("strong");
  price.className = "price";
  price.textContent = formatPrice(game.salePrice);
  prices.append(price);

  body.append(title, store, prices);
  li.append(cover, body);
  return li;
}

// Sorting returns a new array and never changes the original list.
function sortGames(list, mode) {
  const copy = [...list];
  if (mode === "price") copy.sort((a, b) => a.salePrice - b.salePrice);
  if (mode === "discount") copy.sort((a, b) => discountPercent(b) - discountPercent(a));
  if (mode === "title") copy.sort((a, b) => a.title.localeCompare(b.title));
  return copy;
}

// Smoothly count a number up to its new value (skipped if motion is reduced).
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function animateNumber(el, target, suffix) {
  const from = parseInt(el.dataset.value || "0", 10);
  el.dataset.value = String(target);
  if (reduceMotion || from === target) {
    el.textContent = target + suffix;
    return;
  }
  const start = performance.now();
  const duration = 450;
  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (target - from) * eased) + suffix;
    if (t < 1 && el.dataset.value === String(target)) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function renderStores() {
  const names = ["All", ...new Set(currentGames.map((g) => g.store))];
  if (!names.includes(activeStore)) activeStore = "All";
  storeListEl.replaceChildren(
    ...names.map((name) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "store-chip" + (name === activeStore ? " active" : "");
      btn.textContent = name;
      btn.addEventListener("click", () => {
        activeStore = name;
        renderStores();
        render();
      });
      return btn;
    })
  );
}

function syncNavTabs() {
  let view = "all";
  if (onlySaleEl.checked) view = sortEl.value === "discount" ? "best" : "sale";
  navTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
}

// animate = false while typing so cards don't re-animate on every keystroke.
function render(animate = true) {
  let visible = searchByTitle(currentGames, searchEl.value);
  if (activeStore !== "All") visible = visible.filter((g) => g.store === activeStore);
  if (onlySaleEl.checked) visible = getOnSale(visible);
  visible = sortGames(visible, sortEl.value);

  dealsEl.classList.toggle("animate", animate);
  dealsEl.replaceChildren(...visible.map(buildCard));
  syncNavTabs();

  // Sidebar stats
  animateNumber(statCountEl, visible.length, "");
  animateNumber(statBestEl, Math.max(0, ...visible.map(discountPercent)), "%");

  if (visible.length === 0) {
    summaryEl.textContent = "No games match your search.";
    statCheapestEl.textContent = "—";
    return;
  }
  const cheapest = cheapestGame(visible);
  statCheapestEl.textContent = cheapest.title + " · " + formatPrice(cheapest.salePrice);
  summaryEl.textContent =
    visible.length + " game" + (visible.length === 1 ? "" : "s") +
    " · cheapest: " + cheapest.title + " at " + formatPrice(cheapest.salePrice);
}

// ---- Menu bar tabs -----------------------------------------------------
navTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const view = tab.dataset.view;
    onlySaleEl.checked = view !== "all";
    sortEl.value = view === "best" ? "discount" : "default";
    render();
  });
});

// ---- Mobile sidebar toggle ---------------------------------------------
function setSidebar(open) {
  sidebarEl.classList.toggle("open", open);
  backdropEl.classList.toggle("show", open);
  menuToggleEl.setAttribute("aria-expanded", String(open));
}
menuToggleEl.addEventListener("click", () => setSidebar(!sidebarEl.classList.contains("open")));
backdropEl.addEventListener("click", () => setSidebar(false));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setSidebar(false); });

// ---- Stretch: real data from CheapShark -------------------------------
const STORE_NAMES = { "1": "Steam", "7": "GOG", "25": "Epic Games" };

async function loadLiveDeals() {
  loadLiveEl.disabled = true;
  loadLiveEl.textContent = "Loading…";
  try {
    const url = "https://www.cheapshark.com/api/1.0/deals?pageSize=20&upperPrice=30";
    const response = await fetch(url);
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();

    // Map CheapShark's shape onto ours (it returns prices as strings).
    currentGames = data.map((d, i) => ({
      id: d.dealID || i,
      title: d.title,
      normalPrice: parseFloat(d.normalPrice),
      salePrice: parseFloat(d.salePrice),
      store: STORE_NAMES[d.storeID] || "Store #" + d.storeID,
    }));
    currencySymbol = "$";
    sourceNoteEl.textContent = "Live data from CheapShark · prices in US dollars ($)";
    loadLiveEl.textContent = "Live deals loaded";
    renderStores();
    render();
  } catch (err) {
    console.error(err);
    sourceNoteEl.textContent = "Couldn't load live deals — showing sample data. Prices in Rand (R)";
    loadLiveEl.disabled = false;
    loadLiveEl.textContent = "Retry live deals";
  }
}

searchEl.addEventListener("input", () => render(false)); // live search on every keystroke
onlySaleEl.addEventListener("change", () => render());
sortEl.addEventListener("change", () => render());
loadLiveEl.addEventListener("click", loadLiveDeals);

renderStores();
render();
