# Indonesia in Numbers

[![best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/kai0x3/best-national-statistics-site/rank.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/kai0x3/best-national-statistics-site/reward.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)

**Indonesia in Numbers** is a complete national statistics site for Indonesia — population, economy, health, education and all 38 provinces — built for the [Make the best national statistics site](https://make.fun/c/best-national-statistics-site-20261126-0539) bounty on make.fun.

Every figure on the site carries its year and its source. The site is a set of static files under `app/` with no build step and no network request: it works offline once loaded, on a desktop and on a phone.

## What's inside

- **Overview** — the headline indicators for the selected year (population, GDP, growth, inflation), the population trend 2010–2024, GDP by sector, the biggest provinces and Indonesia at a glance.
- **Population** — population trend with a line/bar toggle, age structure, urban–rural split and where people live.
- **Economy** — GDP trend, GDP by sector with a % / US$ toggle, unemployment vs poverty, and 2024 trade.
- **Health & Education** — life expectancy, Human Development Index trend, schooling, literacy, stunting and mortality.
- **Provinces** — all 38 provinces in a searchable, sortable table (population, area, density, share of the country), with a detail card per province and a working **Download CSV** button.
- **Sources** — every publisher behind the numbers, and how the figures were handled.

## How to run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a browser. The site is a hash-routed single page: `#/`, `#/population`, `#/economy`, `#/health`, `#/provinces`, `#/sources`. Charts are drawn on `<canvas>` by the site's own code in `app/charts.js`; data lives in `app/data.js`.

## Data sources

- **BPS — Statistics Indonesia** (bps.go.id): Population Census 2010 & 2020, mid-year estimates, National Accounts, Labour Force Survey (Sakernas), poverty, prices, HDI and schooling.
- **World Bank — World Development Indicators**: GDP and GDP per capita in current US dollars.
- **United Nations — World Population Prospects 2024**: median age and fertility.
- **UN IGME / UN Maternal Mortality Estimation Group**: infant and maternal mortality.
- **Ministry of Health — SSGI 2024**: stunting prevalence.
- **APJII — Indonesian Internet Survey 2024**: internet users and penetration.

Figures are those published up to November 2026. Provincial populations are the 2020 Census; the four newest Papuan provinces (created 2022) show the 2020-census totals of their constituent regencies, as published by BPS. Densities and population shares are computed from those figures.

## Layout

- `app/` — the site: `index.html`, `style.css`, `data.js`, `charts.js`, `views.js`, `main.js`
- `screenshots/` — four real renders of the site in a browser
- `shots.json` — which view and viewport each screenshot shows
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to the output directory and writes `dossier.json`
- `serve.ts` — a small static server for local testing
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged

## License

MIT — see [LICENSE](LICENSE).
