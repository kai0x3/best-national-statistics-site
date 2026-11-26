// Indonesia in Numbers — router, state and controls.
// Hash routes: #/ (overview), #/population, #/economy, #/health,
// #/provinces, #/sources. Every control on every page works: the year
// selector re-renders the figures, the toggles redraw the charts, the
// province table searches, sorts and downloads as CSV.

const state = {
  year: 2024,
  sectorMode: "share",
  trendMode: "line",
  provinceQuery: "",
  provinceSort: "pop",
  provinceSortDir: -1,
  selectedProvince: null
};

const pageEl = document.getElementById("page");
const navEl = document.getElementById("mainNav");

function currentRoute() {
  const hash = window.location.hash || "#/";
  const route = hash.replace(/^#\/?/, "").split("/")[0];
  return ["", "population", "economy", "health", "provinces", "sources"].includes(route) ? route : "";
}

function render() {
  const route = currentRoute();
  navEl.innerHTML = navLinks(route);
  pageEl.innerHTML = renderPage(route, state);
  drawCharts(route);
  window.scrollTo(0, 0);
}

function drawCharts(route) {
  const y = state.year;
  const byId = (id) => document.getElementById(id);

  if (route === "" || route === "population") {
    const trend = byId("chartPopTrend");
    if (trend) {
      const points = POPULATION_TREND.filter((p) => p[0] <= y);
      if (state.trendMode === "bar") {
        drawBarChart(trend, points.map((p) => ({ label: String(p[0]), value: p[1] })), {
          format: (v) => v.toFixed(0) + "m", height: 280, labelMax: 6
        });
      } else {
        drawLineChart(trend, points, { format: (v) => v.toFixed(0) + "m", height: 280 });
      }
    }
  }
  if (route === "") {
    const sectors = byId("chartSectors");
    if (sectors) drawSectorChart(sectors);
  }
  if (route === "population") {
    const age = byId("chartAge");
    if (age) {
      drawHBarChart(age, AGE_STRUCTURE.map((a) => ({ label: a.group, value: a.share })), {
        format: (v) => v.toFixed(1) + "%", rowHeight: 38
      });
    }
    const urban = byId("chartUrban");
    if (urban) {
      drawDonut(urban, [
        { label: "Urban", value: HEALTH.urbanShare.value },
        { label: "Rural", value: 100 - HEALTH.urbanShare.value }
      ], { centre: HEALTH.urbanShare.value + "%", centreSub: "urban", size: 220 });
    }
  }
  if (route === "economy") {
    const gdp = byId("chartGdpTrend");
    if (gdp) {
      drawLineChart(gdp, GDP_TREND.filter((p) => p[0] <= y), {
        format: (v) => "$" + v.toFixed(2) + "T", height: 280
      });
    }
    const sectors = byId("chartSectors");
    if (sectors) drawSectorChart(sectors);
    const jobs = byId("chartJobs");
    if (jobs) {
      const yrs = INDONESIA.years.filter((yy) => yy <= y);
      drawTwoLineChart(jobs,
        { label: "Unemployment", color: CHART.teal, points: yrs.map((yy) => [yy, INDONESIA.unemployment[yy]]) },
        { label: "Poverty", color: CHART.amber, points: yrs.map((yy) => [yy, INDONESIA.poverty[yy]]) },
        { format: (v) => v.toFixed(1) + "%", height: 280 });
    }
  }
  if (route === "health") {
    const hdi = byId("chartHdi");
    if (hdi) {
      const yrs = INDONESIA.years.filter((yy) => yy <= y);
      drawLineChart(hdi, yrs.map((yy) => [yy, INDONESIA.hdi[yy]]), {
        format: (v) => v.toFixed(1), min: 70, height: 280
      });
    }
  }
}

function drawSectorChart(canvas) {
  const items = GDP_SECTORS.slice(0, 8).map((s) => ({
    label: s.name,
    value: state.sectorMode === "share" ? s.share : s.value
  }));
  drawBarChart(canvas, items, {
    format: state.sectorMode === "share" ? (v) => v.toFixed(1) + "%" : (v) => "$" + v.toFixed(0) + "B",
    height: 300, labelMax: 13
  });
}

// ---------- Controls (event delegation on the page container) ----------

pageEl.addEventListener("change", (event) => {
  if (event.target.id === "yearSelect") {
    state.year = Number(event.target.value);
    render();
  }
});

pageEl.addEventListener("input", (event) => {
  if (event.target.id === "provinceSearch") {
    state.provinceQuery = event.target.value;
    refreshProvinceTable();
    // Keep the caret in the search box after the table re-renders.
    const box = document.getElementById("provinceSearch");
    if (box) {
      box.focus();
      box.setSelectionRange(box.value.length, box.value.length);
    }
  }
});

pageEl.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-trend]");
  if (toggle) {
    state.trendMode = toggle.getAttribute("data-trend");
    render();
    return;
  }
  const sector = event.target.closest("[data-sector]");
  if (sector) {
    state.sectorMode = sector.getAttribute("data-sector");
    render();
    return;
  }
  const sortBtn = event.target.closest("[data-sort]");
  if (sortBtn) {
    const key = sortBtn.getAttribute("data-sort");
    if (state.provinceSort === key) {
      state.provinceSortDir = -state.provinceSortDir;
    } else {
      state.provinceSort = key;
      state.provinceSortDir = key === "name" ? 1 : -1;
    }
    refreshProvinceTable();
    return;
  }
  if (event.target.id === "downloadCsv") {
    downloadProvincesCsv();
    return;
  }
  if (event.target.id === "closeDetail") {
    state.selectedProvince = null;
    render();
    return;
  }
  const row = event.target.closest("tr[data-province]");
  if (row) {
    const name = row.getAttribute("data-province");
    state.selectedProvince = state.selectedProvince === name ? null : name;
    render();
    const detail = document.getElementById("provinceDetail");
    if (detail) detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
});

function refreshProvinceTable() {
  const body = document.getElementById("provBody");
  if (body) body.innerHTML = provinceRows(state);
  const head = document.querySelector("#provTable thead");
  if (head) {
    head.querySelectorAll("[data-sort]").forEach((btn) => {
      btn.innerHTML = btn.textContent.replace(/[↑↓↕]\s*$/, "").trim() + " " + sortArrow(state, btn.getAttribute("data-sort"));
    });
  }
}

function downloadProvincesCsv() {
  const total = PROVINCES.reduce((s, p) => s + p.pop, 0);
  const lines = ["Province,Population 2020,Area (km2),Density (per km2),Share of population (%)"];
  PROVINCES.slice().sort((a, b) => b.pop - a.pop).forEach((p) => {
    lines.push([
      '"' + p.name + '"',
      p.pop,
      p.area,
      Math.round(p.pop / p.area),
      (p.pop / total * 100).toFixed(2)
    ].join(","));
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "indonesia-provinces-2020-census.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

window.addEventListener("hashchange", render);
render();
