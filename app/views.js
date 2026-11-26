// Page views for Indonesia in Numbers. Each view returns an HTML string
// for its route; main.js mounts it and draws the canvases afterwards.

function fmtMillions(v) { return v.toFixed(1) + " million"; }
function fmtInt(n) { return n.toLocaleString("en-US"); }
function fmtPct(v) { return v.toFixed(2) + "%"; }
function fmtMoney(v) { return "$" + v.toFixed(2) + " trillion"; }
function yearOptions(year) {
  return INDONESIA.years.map((y) =>
    '<option value="' + y + '"' + (y === year ? " selected" : "") + ">" + y + "</option>").join("");
}
function sourceNote(text) { return '<p class="source-note">Source: ' + text + "</p>"; }
function yearSelector(year, label) {
  return '<label class="year-picker">' + (label || "Data year") +
    ' <select id="yearSelect" aria-label="Data year">' + yearOptions(year) + "</select></label>";
}
function kpiCard(label, value, sub, source) {
  return '<article class="kpi"><p class="kpi-label">' + label + '</p>' +
    '<p class="kpi-value">' + value + '</p>' +
    '<p class="kpi-sub">' + sub + '</p>' +
    '<p class="kpi-source">' + source + "</p></article>";
}
function navActive(route, name, label) {
  return '<a href="#/' + name + '" class="' + (route === name ? "active" : "") + '">' + label + "</a>";
}

// ---------- Overview ----------
function viewOverview(state) {
  const y = state.year;
  const prev = y - 1;
  const popChange = ((INDONESIA.population[y] - INDONESIA.population[prev]) / INDONESIA.population[prev] * 100).toFixed(2);
  const topProvinces = PROVINCES.slice(0, 5);
  return '' +
  '<section class="hero">' +
    '<p class="eyebrow">Official statistics · Indonesia</p>' +
    '<h1>Indonesia in Numbers</h1>' +
    '<p class="lede">The people, the economy and the provinces of the world\u2019s fourth most populous country — every figure with its year and its source.</p>' +
    '<div class="hero-actions">' +
      '<a class="btn" href="#/population">Explore the population</a>' +
      '<a class="btn btn-ghost" href="#/provinces">Browse all 38 provinces</a>' +
    '</div>' +
  '</section>' +
  '<section class="toolbar">' + yearSelector(y) +
    '<p class="toolbar-note">Figures update when you change the year.</p></section>' +
  '<section class="kpi-grid">' +
    kpiCard("Population", fmtMillions(INDONESIA.population[y]), "+" + popChange + "% on " + prev, "BPS, " + y) +
    kpiCard("GDP", fmtMoney(INDONESIA.gdpNominal[y]), "US$ " + fmtInt(INDONESIA.gdpPerCapita[y]) + " per person", "World Bank, " + y) +
    kpiCard("GDP growth", INDONESIA.gdpGrowth[y].toFixed(2) + "%", "Year on year, constant prices", "BPS, " + y) +
    kpiCard("Inflation", fmtPct(INDONESIA.inflation[y]), "Consumer prices, year on year", "BPS, " + y) +
  '</section>' +
  '<section class="grid-2">' +
    '<article class="card"><h2>Population 2010–' + y + '</h2>' +
      '<p class="card-sub">Indonesia added about 44 million people between 2010 and ' + y + '.</p>' +
      '<canvas id="chartPopTrend" class="chart" role="img" aria-label="Line chart of Indonesia population 2010 to ' + y + '"></canvas>' +
      sourceNote("BPS — Statistics Indonesia, Census 2010 &amp; 2020 and mid-year estimates.") +
    '</article>' +
    '<article class="card"><h2>Where the economy comes from</h2>' +
      '<p class="card-sub">Share of GDP by sector, ' + y + '. Manufacturing is the largest single sector.</p>' +
      '<canvas id="chartSectors" class="chart" role="img" aria-label="Bar chart of GDP by sector"></canvas>' +
      sourceNote("BPS — Statistics Indonesia, National Accounts " + y + ".") +
    '</article>' +
  '</section>' +
  '<section class="grid-2">' +
    '<article class="card"><h2>Biggest provinces</h2>' +
      '<p class="card-sub">Population, 2020 Census. Three provinces on Java hold over half the country.</p>' +
      '<ol class="rank-list">' + topProvinces.map((p, i) =>
        '<li><span class="rank-num">' + (i + 1) + '</span><a href="#/provinces">' + p.name + '</a>' +
        '<span class="rank-val">' + fmtMillions(p.pop / 1e6) + '</span></li>').join("") + '</ol>' +
      '<p><a class="text-link" href="#/provinces">See all 38 provinces &rarr;</a></p>' +
    '</article>' +
    '<article class="card"><h2>People in ' + y + '</h2>' +
      '<dl class="fact-list">' +
      '<div><dt>Unemployment</dt><dd>' + fmtPct(INDONESIA.unemployment[y]) + ' <span>of the labour force (August)</span></dd></div>' +
      '<div><dt>Poverty rate</dt><dd>' + fmtPct(INDONESIA.poverty[y]) + ' <span>below the poverty line (September)</span></dd></div>' +
      '<div><dt>Life expectancy</dt><dd>' + INDONESIA.lifeExpectancy[y].toFixed(2) + ' years <span>at birth</span></dd></div>' +
      '<div><dt>Human Development Index</dt><dd>' + INDONESIA.hdi[y].toFixed(2) + ' <span>on the 0–100 scale</span></dd></div>' +
      '<div><dt>Mean years of schooling</dt><dd>' + INDONESIA.meanSchooling[y].toFixed(2) + ' years</dd></div>' +
      '</dl>' + sourceNote("BPS — Statistics Indonesia, " + y + ".") +
    '</article>' +
  '</section>' +
  '<section class="card"><h2>Indonesia at a glance</h2>' +
    '<div class="facts-grid">' + KEY_FACTS.map((f) =>
      '<div class="fact"><p class="fact-value">' + f.value + '</p><p class="fact-label">' + f.label + '</p><p class="fact-note">' + f.note + '</p></div>').join("") +
    '</div>' + sourceNote("BPS — Statistics Indonesia; UN World Population Prospects 2024.") +
  '</section>';
}

// ---------- Population ----------
function viewPopulation(state) {
  const y = state.year;
  const trend = POPULATION_TREND.filter((p) => p[0] <= y);
  const urban = HEALTH.urbanShare.value;
  return '' +
  '<section class="page-head"><p class="eyebrow">Population</p><h1>281.6 million people, and still growing</h1>' +
  '<p class="lede">Indonesia is the world\u2019s fourth most populous country. Growth has slowed from over 1.4% a year in the 2010s to about 0.9% in 2024 — but the population still adds roughly 2.5 million people a year.</p></section>' +
  '<section class="toolbar">' + yearSelector(y) +
    '<div class="toggle-group" role="group" aria-label="Trend chart style">' +
      '<button class="toggle' + (state.trendMode === "line" ? " on" : "") + '" data-trend="line">Line</button>' +
      '<button class="toggle' + (state.trendMode === "bar" ? " on" : "") + '" data-trend="bar">Bars</button>' +
    '</div></section>' +
  '<section class="kpi-grid">' +
    kpiCard("Population " + y, fmtMillions(INDONESIA.population[y]), "4th largest in the world", "BPS, " + y) +
    kpiCard("Median age", HEALTH.medianAge.value + " years", "Half the population is younger than this", "UN, " + HEALTH.medianAge.year) +
    kpiCard("Fertility rate", HEALTH.fertility.value + "", "births per woman — near replacement level (2.1)", "BPS / UN, " + HEALTH.fertility.year) +
    kpiCard("Urban population", urban + "%", "About " + Math.round(INDONESIA.population[y] * urban / 100) + " million people live in cities", "BPS, " + HEALTH.urbanShare.year) +
  '</section>' +
  '<section class="grid-2">' +
    '<article class="card"><h2>Population trend, 2010–' + y + '</h2>' +
      '<p class="card-sub">Millions of people. Switch between a line and bars with the toggle above.</p>' +
      '<canvas id="chartPopTrend" class="chart" role="img" aria-label="Population trend chart"></canvas>' +
      sourceNote("BPS — Statistics Indonesia, Census 2010 &amp; 2020, intercensal and mid-year estimates.") +
    '</article>' +
    '<article class="card"><h2>Age structure, ' + y + '</h2>' +
      '<p class="card-sub">Share of the population in each age band. The working-age bulge is the demographic dividend: 68.9% of Indonesians are aged 15–64.</p>' +
      '<canvas id="chartAge" class="chart" role="img" aria-label="Age structure chart"></canvas>' +
      sourceNote("BPS — Statistics Indonesia, " + y + ".") +
    '</article>' +
  '</section>' +
  '<section class="grid-2">' +
    '<article class="card"><h2>Urban and rural</h2>' +
      '<p class="card-sub">More than half of Indonesians now live in urban areas — up from 49.8% in 2010.</p>' +
      '<canvas id="chartUrban" class="chart chart-donut" role="img" aria-label="Urban rural split donut chart"></canvas>' +
      '<ul class="legend"><li><span class="swatch sw-teal"></span>Urban — ' + urban + '%</li>' +
      '<li><span class="swatch sw-amber"></span>Rural — ' + (100 - urban).toFixed(1) + '%</li></ul>' +
      sourceNote("BPS — Statistics Indonesia, 2024.") +
    '</article>' +
    '<article class="card"><h2>Where people live</h2>' +
      '<p class="card-sub">Java holds 56% of the population on 7% of the land. The five most populous provinces:</p>' +
      '<ol class="rank-list">' + PROVINCES.slice(0, 5).map((p, i) =>
        '<li><span class="rank-num">' + (i + 1) + '</span><a href="#/provinces">' + p.name + '</a>' +
        '<span class="rank-val">' + fmtMillions(p.pop / 1e6) + '</span></li>').join("") + '</ol>' +
      '<p><a class="text-link" href="#/provinces">Full province table &rarr;</a></p>' +
    '</article>' +
  '</section>';
}

// ---------- Economy ----------
function viewEconomy(state) {
  const y = state.year;
  const sectors = GDP_SECTORS.slice(0, 8);
  return '' +
  '<section class="page-head"><p class="eyebrow">Economy</p><h1>Southeast Asia\u2019s largest economy</h1>' +
  '<p class="lede">Indonesia\u2019s economy passed US$1.4 trillion in 2024. Growth has held at about 5% a year since the pandemic rebound, driven by household consumption, manufacturing and commodity exports.</p></section>' +
  '<section class="toolbar">' + yearSelector(y) +
    '<div class="toggle-group" role="group" aria-label="Sector chart values">' +
      '<button class="toggle' + (state.sectorMode === "share" ? " on" : "") + '" data-sector="share">% of GDP</button>' +
      '<button class="toggle' + (state.sectorMode === "value" ? " on" : "") + '" data-sector="value">US$ billion</button>' +
    '</div></section>' +
  '<section class="kpi-grid">' +
    kpiCard("GDP " + y, fmtMoney(INDONESIA.gdpNominal[y]), "16th largest economy in the world", "World Bank, " + y) +
    kpiCard("GDP per capita", "$" + fmtInt(INDONESIA.gdpPerCapita[y]), "Upper-middle-income country since 2023", "World Bank, " + y) +
    kpiCard("GDP growth", INDONESIA.gdpGrowth[y].toFixed(2) + "%", "Year on year, constant prices", "BPS, " + y) +
    kpiCard("Inflation", fmtPct(INDONESIA.inflation[y]), "Within Bank Indonesia\u2019s 2.5% ± 1% target", "BPS, " + y) +
  '</section>' +
  '<section class="grid-2">' +
    '<article class="card"><h2>GDP, 2015–' + y + '</h2>' +
      '<p class="card-sub">Nominal GDP in US$ trillion. The 2020 dip is the pandemic recession — the only contraction in two decades.</p>' +
      '<canvas id="chartGdpTrend" class="chart" role="img" aria-label="GDP trend chart"></canvas>' +
      sourceNote("World Bank, World Development Indicators.") +
    '</article>' +
    '<article class="card"><h2>GDP by sector, ' + y + '</h2>' +
      '<p class="card-sub">Toggle between share of GDP and value in US$ billion.</p>' +
      '<canvas id="chartSectors" class="chart" role="img" aria-label="GDP by sector bar chart"></canvas>' +
      sourceNote("BPS — Statistics Indonesia, National Accounts " + y + ".") +
    '</article>' +
  '</section>' +
  '<section class="grid-2">' +
    '<article class="card"><h2>Work and poverty</h2>' +
      '<p class="card-sub">Unemployment and poverty, 2020–' + y + '. Both fell every year after the 2020 pandemic peak.</p>' +
      '<canvas id="chartJobs" class="chart" role="img" aria-label="Unemployment and poverty chart"></canvas>' +
      sourceNote("BPS — Statistics Indonesia: unemployment, August Sakernas; poverty, September.") +
    '</article>' +
    '<article class="card"><h2>Trade in 2024</h2>' +
      '<dl class="fact-list">' +
      '<div><dt>Exports</dt><dd>US$' + TRADE_2024.exports + ' billion</dd></div>' +
      '<div><dt>Imports</dt><dd>US$' + TRADE_2024.imports + ' billion</dd></div>' +
      '<div><dt>Trade surplus</dt><dd>US$' + TRADE_2024.surplus.toFixed(1) + ' billion — the fifth straight yearly surplus</dd></div>' +
      '<div><dt>Top exports</dt><dd>' + TRADE_2024.topExport + '</dd></div>' +
      '<div><dt>Largest partner</dt><dd>' + TRADE_2024.topPartner + '</dd></div>' +
      '</dl>' + sourceNote(TRADE_2024.source + ".") +
    '</article>' +
  '</section>';
}

// ---------- Health & Education ----------
function viewHealth(state) {
  const y = state.year;
  const hdiTrend = INDONESIA.years.filter((yy) => yy <= y).map((yy) => [yy, INDONESIA.hdi[yy]]);
  return '' +
  '<section class="page-head"><p class="eyebrow">Health &amp; education</p><h1>Living longer, learning longer</h1>' +
  '<p class="lede">Life expectancy reached 73.9 years in 2024 and the Human Development Index passed 75 for the first time. The remaining challenges are familiar ones: stunting, uneven schooling and a health system stretched across 17,000 islands.</p></section>' +
  '<section class="toolbar">' + yearSelector(y) + '</section>' +
  '<section class="kpi-grid">' +
    kpiCard("Life expectancy", INDONESIA.lifeExpectancy[y].toFixed(2) + " years", "At birth", "BPS, " + y) +
    kpiCard("Human Development Index", INDONESIA.hdi[y].toFixed(2), "High human development (UN bands)", "BPS, " + y) +
    kpiCard("Mean years of schooling", INDONESIA.meanSchooling[y].toFixed(2) + " years", "Adults aged 25 and over", "BPS, " + y) +
    kpiCard("Literacy rate", INDONESIA.literacy[y].toFixed(2) + "%", "Population aged 15 and over", "BPS, " + y) +
  '</section>' +
  '<section class="grid-2">' +
    '<article class="card"><h2>Human Development Index, 2020–' + y + '</h2>' +
      '<p class="card-sub">The index combines health, education and income. The jump in 2023 reflects updated life-expectancy data.</p>' +
      '<canvas id="chartHdi" class="chart" role="img" aria-label="HDI trend chart"></canvas>' +
      sourceNote("BPS — Statistics Indonesia, Human Development Index.") +
    '</article>' +
    '<article class="card"><h2>Health in numbers</h2>' +
      '<dl class="fact-list">' +
      '<div><dt>Stunting</dt><dd>' + HEALTH.stunting.value + '% <span>of children under 5 — ' + HEALTH.stunting.year + '</span></dd></div>' +
      '<div><dt>Infant mortality</dt><dd>' + HEALTH.infantMortality.value + ' <span>' + HEALTH.infantMortality.unit + ' — ' + HEALTH.infantMortality.year + '</span></dd></div>' +
      '<div><dt>Maternal mortality</dt><dd>' + HEALTH.maternalMortality.value + ' <span>' + HEALTH.maternalMortality.unit + ' — ' + HEALTH.maternalMortality.year + '</span></dd></div>' +
      '<div><dt>Internet users</dt><dd>' + HEALTH.internetUsers.value + ' million <span>' + HEALTH.internetPenetration.value + '% of the population — ' + HEALTH.internetUsers.year + '</span></dd></div>' +
      '</dl>' +
      sourceNote("Ministry of Health SSGI 2024; UN IGME 2023; UN MMEIG 2020; APJII 2024.") +
    '</article>' +
  '</section>' +
  '<section class="card"><h2>Education: what the numbers say</h2>' +
    '<p>Schooling is compulsory for 12 years, and near-universal primary enrolment has been in place for a generation. The binding constraint is quality and length: adults average ' + INDONESIA.meanSchooling[y].toFixed(2) + ' years of schooling in ' + y + ', and the government\u2019s target is 9 years. Literacy among people aged 15 and over is ' + INDONESIA.literacy[y].toFixed(2) + '% — but it falls below 90% in several eastern provinces, which is why the national average hides the real story. See the <a class="text-link" href="#/provinces">province table</a> for where the gaps are widest.</p>' +
    sourceNote("BPS — Statistics Indonesia, " + y + ".") +
  '</section>';
}

// ---------- Provinces ----------
function provinceRows(state) {
  const total = PROVINCES.reduce((s, p) => s + p.pop, 0);
  let rows = PROVINCES.slice();
  const q = state.provinceQuery.trim().toLowerCase();
  if (q) rows = rows.filter((p) => p.name.toLowerCase().includes(q));
  const key = state.provinceSort;
  const dir = state.provinceSortDir;
  const val = (p) => key === "name" ? p.name : key === "area" ? p.area : key === "density" ? p.pop / p.area : p.pop;
  rows.sort((a, b) => {
    const va = val(a), vb = val(b);
    if (va < vb) return -1 * dir;
    if (va > vb) return 1 * dir;
    return 0;
  });
  if (!rows.length) return '<tr><td colspan="6" class="empty-row">No province matches \u201c' + state.provinceQuery + '\u201d. Try another spelling.</td></tr>';
  return rows.map((p, i) => {
    const density = p.pop / p.area;
    const share = (p.pop / total * 100).toFixed(2);
    const gdp = PROVINCE_GDP_SHARE[p.name];
    return '<tr data-province="' + p.name + '" class="' + (state.selectedProvince === p.name ? "selected" : "") + '">' +
      '<td>' + (i + 1) + '</td><td class="prov-name">' + p.name + '</td>' +
      '<td class="num">' + fmtInt(p.pop) + '</td>' +
      '<td class="num">' + fmtInt(p.area) + '</td>' +
      '<td class="num">' + fmtInt(Math.round(density)) + '</td>' +
      '<td class="num">' + share + '%</td></tr>';
  }).join("");
}

function provinceDetail(state) {
  if (!state.selectedProvince) return "";
  const p = PROVINCES.find((x) => x.name === state.selectedProvince);
  if (!p) return "";
  const total = PROVINCES.reduce((s, x) => s + x.pop, 0);
  const rank = PROVINCES.slice().sort((a, b) => b.pop - a.pop).findIndex((x) => x.name === p.name) + 1;
  const gdp = PROVINCE_GDP_SHARE[p.name];
  return '<article class="card detail-card" id="provinceDetail"><button class="close-detail" id="closeDetail" aria-label="Close province detail">×</button>' +
    '<h2>' + p.name + '</h2>' +
    '<p class="card-sub">Ranked #' + rank + ' of 38 provinces by population (2020 Census).</p>' +
    '<div class="detail-grid">' +
      '<div><p class="detail-value">' + fmtInt(p.pop) + '</p><p class="detail-label">Population, 2020 Census</p></div>' +
      '<div><p class="detail-value">' + fmtInt(p.area) + ' km²</p><p class="detail-label">Land area</p></div>' +
      '<div><p class="detail-value">' + fmtInt(Math.round(p.pop / p.area)) + ' / km²</p><p class="detail-label">Population density</p></div>' +
      '<div><p class="detail-value">' + (p.pop / total * 100).toFixed(2) + '%</p><p class="detail-label">Share of Indonesia\u2019s population</p></div>' +
    '</div>' +
    (gdp ? '<p>Share of national GDP (2024, BPS): about <strong>' + gdp + '%</strong>.</p>' : '<p>No separate GDP share is published for this province in the top-10 breakdown; its economy is counted in the national total.</p>') +
    sourceNote("BPS — Statistics Indonesia, Population Census 2020; land area, BPS.") +
  '</article>';
}

function viewProvinces(state) {
  return '' +
  '<section class="page-head"><p class="eyebrow">Provinces</p><h1>38 provinces, one table</h1>' +
  '<p class="lede">Every province, ranked and searchable. Tap a row for its detail card, sort by any column, or download the whole table as a CSV file.</p></section>' +
  '<section class="toolbar">' +
    '<label class="search-box">Search provinces <input id="provinceSearch" type="search" placeholder="e.g. Java, Papua, Bali…" value="' + state.provinceQuery.replace(/"/g, "&quot;") + '"></label>' +
    '<button class="btn" id="downloadCsv">Download CSV</button>' +
  '</section>' +
  '<div id="provinceDetailSlot">' + provinceDetail(state) + '</div>' +
  '<section class="card table-card"><div class="table-scroll"><table class="prov-table" id="provTable">' +
    '<thead><tr>' +
      '<th>#</th>' +
      '<th><button class="sort-btn" data-sort="name">Province ' + sortArrow(state, "name") + '</button></th>' +
      '<th><button class="sort-btn" data-sort="pop">Population (2020) ' + sortArrow(state, "pop") + '</button></th>' +
      '<th><button class="sort-btn" data-sort="area">Area (km²) ' + sortArrow(state, "area") + '</button></th>' +
      '<th><button class="sort-btn" data-sort="density">Density (/km²) ' + sortArrow(state, "density") + '</button></th>' +
      '<th>Share of population</th>' +
    '</tr></thead><tbody id="provBody">' + provinceRows(state) + '</tbody></table></div>' +
    sourceNote("BPS — Statistics Indonesia, Population Census 2020. The four newest Papuan provinces (created 2022) show the 2020-census totals of their constituent regencies, as published by BPS. Density is population ÷ land area.") +
  '</section>';
}

function sortArrow(state, key) {
  if (state.provinceSort !== key) return "↕";
  return state.provinceSortDir === 1 ? "↑" : "↓";
}

// ---------- Sources ----------
function viewSources() {
  return '' +
  '<section class="page-head"><p class="eyebrow">Sources &amp; about</p><h1>Where every number comes from</h1>' +
  '<p class="lede">A statistics site is only as good as its sources. Every figure on this site carries its year and its publisher; this page lists them all, and how the numbers were handled.</p></section>' +
  '<section class="card"><h2>Sources</h2><ul class="source-list">' +
    SOURCES.map((s) => '<li><p class="source-name">' + s.name + '</p><p class="source-url">' + s.urlText + '</p><p>' + s.about + '</p></li>').join("") +
  '</ul></section>' +
  '<section class="grid-2">' +
    '<article class="card"><h2>How the numbers are handled</h2>' +
    '<ul class="bullets">' +
    '<li>Population figures are BPS mid-year estimates; 2020 is the Census count of 270.20 million.</li>' +
    '<li>GDP in US dollars comes from the World Bank; GDP growth, inflation, unemployment and poverty come from BPS and are quoted exactly as BPS publishes them.</li>' +
    '<li>Provincial populations are the 2020 Census. Densities and shares are computed from those figures, not copied.</li>' +
    '<li>Where a figure is an estimate or a rounded value, the page says so. Nothing here is invented or projected by this site.</li>' +
    '</ul></article>' +
    '<article class="card"><h2>About this site</h2>' +
    '<p><strong>Indonesia in Numbers</strong> is an independent, original statistics reference built for the make.fun national statistics site bounty. It is not affiliated with BPS, the World Bank or the United Nations, and it is not an official publication.</p>' +
    '<p>The site is a set of static files: it makes no network request, stores nothing, and works offline once loaded. Charts are drawn in the browser from the data on this page\u2019s own files.</p>' +
    '<p>Figures are those published up to November 2026. For the latest release, check the source publisher directly.</p></article>' +
  '</section>';
}

// ---------- Router ----------
function renderPage(route, state) {
  if (route === "population") return viewPopulation(state);
  if (route === "economy") return viewEconomy(state);
  if (route === "health") return viewHealth(state);
  if (route === "provinces") return viewProvinces(state);
  if (route === "sources") return viewSources();
  return viewOverview(state);
}

function navLinks(route) {
  return navActive(route, "", "Overview") +
    navActive(route, "population", "Population") +
    navActive(route, "economy", "Economy") +
    navActive(route, "health", "Health &amp; Education") +
    navActive(route, "provinces", "Provinces") +
    navActive(route, "sources", "Sources");
}
