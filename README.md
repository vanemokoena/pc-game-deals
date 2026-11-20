# Pixel Bloom: PC Game Deals

**Live site:** https://vanemokoena.github.io/pc-game-deals/

**Repository:** https://github.com/vanemokoena/pc-game-deals

A small web page that lists PC game deals, shows each sale price, and tags discounted games with **ON SALE**. Built with plain HTML, CSS and JavaScript (no frameworks, no build step), in a dark purple and magenta theme.

<img width="1594" height="814" alt="Screenshot 2026-11-20 213306" src="https://github.com/user-attachments/assets/65adb311-ddaa-4485-9618-29d8482193b9" />

## Features

- Live search by game title
- "On sale only" toggle
- Filter by store (Steam, GOG, Epic Games)
- Sort by featured, lowest price, biggest discount, or title A-Z
- Sidebar stats: games shown, best discount, and cheapest game
- ON SALE tag, discount percentage and struck-through original price on discounted games only
- Game cover images, with a gradient and letter fallback when there's no image
- Optional button to load real deals from the CheapShark API (prices in US dollars)
- Responsive layout with a slide-in filter menu on mobile
- Respects reduced-motion settings

## Setup

1. Keep all the files in one folder, with the `images` folder next to `index.html`.
2. Open `index.html` in any modern browser to run it.
3. Or visit the live site above.

That's it. There is nothing to install.

## What's in each file

- **`index.html`**: the page layout (menu bar, sidebar filters, hero, deal cards).
- **`style.css`**: all styling, colors, animations and the mobile layout.
- **`deals.js`** (Part A): the data and the small pure functions: `isOnSale`, `getOnSale`, `discountPercent`, `cheapestGame`, `searchByTitle`.
- **`app.js`** (Parts B and C): renders every deal, handles search, filters, sorting, stats, and the optional CheapShark live data.
- **`tests.js`**: tests for the functions in `deals.js`.
- **`images/`**: game cover art.

## How it works

- A game counts as **on sale** when its sale price is lower than its normal price.
- The discount percentage is rounded to a whole number, and is 0 for games not on sale.
- Sorting returns a new array and never changes the original list.
- Sample data is shown in Rand (R). Live CheapShark data is shown in US dollars ($).

## Built with

HTML, CSS and vanilla JavaScript.

## Author

Vanessa Mokoena
