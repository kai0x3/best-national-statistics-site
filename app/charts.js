// Canvas charts for Indonesia in Numbers — drawn with plain Canvas 2D,
// no chart library. Every chart is rendered from the data in data.js.

const CHART = {
  teal: "#0e5f58",
  tealLight: "#2a8a80",
  navy: "#12324a",
  amber: "#e8a33d",
  amberDark: "#c97f16",
  coral: "#d96c4f",
  grey: "#8a97a3",
  grid: "#e3e8ec",
  ink: "#1d2b33"
};

function setupCanvas(canvas, heightCss) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  const height = heightCss || 260;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + "px";
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.font = "12px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  return { ctx, width, height };
}

function niceMax(value) {
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * pow;
}

function formatCompact(n) {
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + "k";
  return String(n);
}

// Line chart with filled area, labelled points and a grid.
function drawLineChart(canvas, points, options) {
  const opts = options || {};
  const pad = { left: 52, right: 14, top: 30, bottom: 30 };
  const { ctx, width, height } = setupCanvas(canvas, opts.height || 280);
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const values = points.map((p) => p[1]);
  let min = Math.min.apply(null, values);
  let max = Math.max.apply(null, values);
  if (opts.min !== undefined) min = opts.min;
  if (opts.max !== undefined) max = opts.max;
  if (min > 0 && opts.zero !== false) min = 0;
  const span = max - min || 1;
  const x = (i) => pad.left + (i / (points.length - 1)) * plotW;
  const y = (v) => pad.top + plotH - ((v - min) / span) * plotH;

  // Gridlines and y labels.
  ctx.strokeStyle = CHART.grid;
  ctx.fillStyle = CHART.grey;
  ctx.lineWidth = 1;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const ticks = 4;
  for (let t = 0; t <= ticks; t++) {
    const v = min + (span * t) / ticks;
    const yy = y(v);
    ctx.beginPath();
    ctx.moveTo(pad.left, yy);
    ctx.lineTo(width - pad.right, yy);
    ctx.stroke();
    ctx.fillText(opts.format ? opts.format(v) : formatCompact(v), pad.left - 8, yy);
  }

  // Filled area under the line.
  const grad = ctx.createLinearGradient(0, pad.top, 0, height - pad.bottom);
  grad.addColorStop(0, "rgba(14, 95, 88, 0.22)");
  grad.addColorStop(1, "rgba(14, 95, 88, 0.02)");
  ctx.beginPath();
  ctx.moveTo(x(0), y(points[0][1]));
  points.forEach((p, i) => ctx.lineTo(x(i), y(p[1])));
  ctx.lineTo(x(points.length - 1), height - pad.bottom);
  ctx.lineTo(x(0), height - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line and points.
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(x(i), y(p[1])) : ctx.lineTo(x(i), y(p[1]))));
  ctx.strokeStyle = opts.color || CHART.teal;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.fillStyle = opts.color || CHART.teal;
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(x(i), y(p[1]), 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Value labels on the last and peak points, clamped inside the canvas.
  ctx.fillStyle = CHART.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  const labelled = new Set([points.length - 1]);
  let peak = 0;
  points.forEach((p, i) => { if (p[1] > points[peak][1]) peak = i; });
  labelled.add(peak);
  labelled.forEach((i) => {
    const p = points[i];
    const text = opts.format ? opts.format(p[1]) : String(p[1]);
    const half = ctx.measureText(text).width / 2 + 2;
    const cx = Math.min(Math.max(x(i), pad.left + half), width - pad.right - half);
    ctx.fillText(text, cx, y(p[1]) - 8);
  });

  // X labels, every nth so they never collide, clamped inside the canvas.
  ctx.fillStyle = CHART.grey;
  ctx.textBaseline = "top";
  const step = points.length > 10 ? 2 : 1;
  points.forEach((p, i) => {
    if (i % step === 0 || i === points.length - 1) {
      const text = String(p[0]);
      const half = ctx.measureText(text).width / 2 + 2;
      const cx = Math.min(Math.max(x(i), pad.left + half), width - pad.right - half);
      ctx.fillText(text, cx, height - pad.bottom + 8);
    }
  });
}

// Vertical bar chart, used for GDP by sector and for yearly comparisons.
function drawBarChart(canvas, items, options) {
  const opts = options || {};
  const pad = { left: 52, right: 14, top: 24, bottom: 30 };
  const { ctx, width, height } = setupCanvas(canvas, opts.height || 300);
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const values = items.map((d) => d.value);
  const max = niceMax(Math.max.apply(null, values) * 1.08);
  const slot = plotW / items.length;
  const barW = Math.min(46, slot * 0.62);
  const y = (v) => pad.top + plotH - (v / max) * plotH;

  ctx.strokeStyle = CHART.grid;
  ctx.fillStyle = CHART.grey;
  ctx.lineWidth = 1;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let t = 0; t <= 4; t++) {
    const v = (max * t) / 4;
    const yy = y(v);
    ctx.beginPath();
    ctx.moveTo(pad.left, yy);
    ctx.lineTo(width - pad.right, yy);
    ctx.stroke();
    ctx.fillText(opts.format ? opts.format(v) : formatCompact(v), pad.left - 8, yy);
  }

  const colors = opts.colors || [CHART.teal, CHART.tealLight, CHART.navy, CHART.amber, CHART.coral];
  items.forEach((d, i) => {
    const bx = pad.left + slot * i + (slot - barW) / 2;
    const by = y(d.value);
    ctx.fillStyle = d.color || colors[i % colors.length];
    ctx.beginPath();
    ctx.roundRect(bx, by, barW, pad.top + plotH - by, [4, 4, 0, 0]);
    ctx.fill();
    ctx.fillStyle = CHART.ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(opts.format ? opts.format(d.value) : formatCompact(d.value), bx + barW / 2, by - 5);
    ctx.fillStyle = CHART.grey;
    ctx.textBaseline = "top";
    ctx.save();
    ctx.translate(bx + barW / 2, height - pad.bottom + 8);
    ctx.textAlign = "center";
    ctx.fillText(shortenLabel(d.label, opts.labelMax || 14), 0, 0);
    ctx.restore();
  });
}

function shortenLabel(label, max) {
  if (label.length <= max) return label;
  const cut = label.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ") > 4 ? cut.lastIndexOf(" ") : max - 1) + "…";
}

// Horizontal bar chart, used for age structure and province rankings.
function drawHBarChart(canvas, items, options) {
  const opts = options || {};
  const rowH = opts.rowHeight || 34;
  const pad = { left: 118, right: 56, top: 10, bottom: 10 };
  const { ctx, width, height } = setupCanvas(canvas, rowH * items.length + pad.top + pad.bottom);
  const plotW = width - pad.left - pad.right;
  const max = niceMax(Math.max.apply(null, items.map((d) => d.value)));
  const colors = opts.colors || [CHART.teal, CHART.tealLight, CHART.navy, CHART.amber, CHART.coral];

  items.forEach((d, i) => {
    const cy = pad.top + rowH * i + rowH / 2;
    const barW = (d.value / max) * plotW;
    ctx.fillStyle = CHART.ink;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(d.label, pad.left - 10, cy);
    ctx.fillStyle = d.color || colors[i % colors.length];
    ctx.beginPath();
    ctx.roundRect(pad.left, cy - 10, Math.max(barW, 2), 20, [0, 4, 4, 0]);
    ctx.fill();
    ctx.fillStyle = CHART.ink;
    ctx.textAlign = "left";
    ctx.fillText(opts.format ? opts.format(d.value) : formatCompact(d.value), pad.left + barW + 8, cy);
  });
}

// Two-series line chart with a legend, for comparing two indicators.
function drawTwoLineChart(canvas, seriesA, seriesB, options) {
  const opts = options || {};
  const pad = { left: 52, right: 14, top: 16, bottom: 52 };
  const { ctx, width, height } = setupCanvas(canvas, opts.height || 280);
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const all = seriesA.points.concat(seriesB.points).map((p) => p[1]);
  let min = Math.min.apply(null, all);
  let max = Math.max.apply(null, all);
  if (min > 0) min = 0;
  const span = max - min || 1;
  const x = (i, n) => pad.left + (i / (n - 1)) * plotW;
  const y = (v) => pad.top + plotH - ((v - min) / span) * plotH;

  ctx.strokeStyle = CHART.grid;
  ctx.fillStyle = CHART.grey;
  ctx.lineWidth = 1;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let t = 0; t <= 4; t++) {
    const v = min + (span * t) / 4;
    const yy = y(v);
    ctx.beginPath();
    ctx.moveTo(pad.left, yy);
    ctx.lineTo(width - pad.right, yy);
    ctx.stroke();
    ctx.fillText(opts.format ? opts.format(v) : v.toFixed(1) + "%", pad.left - 8, yy);
  }
  [seriesA, seriesB].forEach((series) => {
    ctx.beginPath();
    series.points.forEach((p, i) => (i === 0 ? ctx.moveTo(x(i, series.points.length), y(p[1])) : ctx.lineTo(x(i, series.points.length), y(p[1]))));
    ctx.strokeStyle = series.color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.fillStyle = series.color;
    series.points.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(x(i, series.points.length), y(p[1]), 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  });
  // X labels and legend.
  ctx.fillStyle = CHART.grey;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  seriesA.points.forEach((p, i) => {
    const text = String(p[0]);
    const half = ctx.measureText(text).width / 2 + 2;
    const cx = Math.min(Math.max(x(i, seriesA.points.length), pad.left + half), width - pad.right - half);
    ctx.fillText(text, cx, height - pad.bottom + 26);
  });
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const ly = height - pad.bottom + 8;
  [seriesA, seriesB].forEach((series, k) => {
    const lx = pad.left + k * 170;
    ctx.fillStyle = series.color;
    ctx.fillRect(lx, ly - 5, 18, 4);
    ctx.fillStyle = CHART.ink;
    ctx.fillText(series.label, lx + 24, ly - 2);
  });
}

// Donut chart with a centre label, used for the urban / rural split.
function drawDonut(canvas, parts, options) {
  const opts = options || {};
  const size = opts.size || 220;
  const { ctx, width, height } = setupCanvas(canvas, size);
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 14;
  const total = parts.reduce((s, p) => s + p.value, 0);
  let angle = -Math.PI / 2;
  const colors = opts.colors || [CHART.teal, CHART.amber, CHART.navy, CHART.coral];
  parts.forEach((p, i) => {
    const sweep = (p.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = p.color || colors[i % colors.length];
    ctx.fill();
    angle += sweep;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.58, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.fillStyle = CHART.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 22px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  ctx.fillText(opts.centre || "", cx, cy - 10);
  ctx.font = "12px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  ctx.fillStyle = CHART.grey;
  ctx.fillText(opts.centreSub || "", cx, cy + 12);
}
