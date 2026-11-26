// Indonesia in Numbers — data module.
// Every figure below is a published statistic with its year and source.
// Main sources: BPS (Statistics Indonesia), World Bank, United Nations.
// Figures are rounded for display; exact values live in the tables.

const INDONESIA = {
  name: "Indonesia",
  capital: "Jakarta",
  currency: "Indonesian rupiah (IDR)",
  // National indicators by year. Keys are calendar years.
  years: [2020, 2021, 2022, 2023, 2024],
  population: { // millions, BPS mid-year estimates; 2020 is the Census count
    2020: 270.20, 2021: 272.25, 2022: 275.77, 2023: 278.69, 2024: 281.60,
    source: "BPS — Statistics Indonesia, Population Census 2020 & mid-year estimates"
  },
  gdpNominal: { // US$ trillion, World Bank
    2020: 1.06, 2021: 1.19, 2022: 1.32, 2023: 1.37, 2024: 1.40,
    source: "World Bank, World Development Indicators"
  },
  gdpPerCapita: { // US$, World Bank
    2020: 3931, 2021: 4350, 2022: 4784, 2023: 4919, 2024: 4925,
    source: "World Bank, World Development Indicators"
  },
  gdpGrowth: { // % year on year, BPS
    2020: -2.07, 2021: 3.70, 2022: 5.31, 2023: 5.05, 2024: 5.03,
    source: "BPS — Statistics Indonesia, National Accounts"
  },
  inflation: { // % year on year, BPS consumer price index
    2020: 1.68, 2021: 1.87, 2022: 5.51, 2023: 2.61, 2024: 1.57,
    source: "BPS — Statistics Indonesia, Consumer Price Index"
  },
  unemployment: { // % of labour force, August survey, BPS
    2020: 7.07, 2021: 6.49, 2022: 5.86, 2023: 5.45, 2024: 4.91,
    source: "BPS — Statistics Indonesia, Sakernas (Labour Force Survey), August"
  },
  poverty: { // % of population below the poverty line, September, BPS
    2020: 10.19, 2021: 9.71, 2022: 9.57, 2023: 9.36, 2024: 8.57,
    source: "BPS — Statistics Indonesia, Poverty Statistics, September"
  },
  lifeExpectancy: { // years at birth, BPS
    2020: 71.47, 2021: 71.57, 2022: 71.85, 2023: 73.55, 2024: 73.93,
    source: "BPS — Statistics Indonesia"
  },
  hdi: { // Human Development Index, BPS
    2020: 71.94, 2021: 72.29, 2022: 72.91, 2023: 74.39, 2024: 75.02,
    source: "BPS — Statistics Indonesia, Human Development Index"
  },
  meanSchooling: { // mean years of schooling, BPS
    2020: 8.48, 2021: 8.54, 2022: 8.69, 2023: 8.77, 2024: 8.85,
    source: "BPS — Statistics Indonesia"
  },
  literacy: { // % of population aged 15+ who can read and write, BPS
    2020: 96.02, 2021: 96.07, 2022: 96.54, 2023: 97.94, 2024: 98.02,
    source: "BPS — Statistics Indonesia"
  }
};

// Population trend, millions, 2010–2024 (BPS Census 2010 & 2020, intercensal
// and mid-year estimates in between).
const POPULATION_TREND = [
  [2010, 237.6], [2011, 241.0], [2012, 244.2], [2013, 247.5], [2014, 250.8],
  [2015, 254.1], [2016, 257.5], [2017, 260.6], [2018, 263.8], [2019, 267.0],
  [2020, 270.2], [2021, 272.3], [2022, 275.8], [2023, 278.7], [2024, 281.6]
];

// Nominal GDP trend, US$ trillion, World Bank.
const GDP_TREND = [
  [2015, 0.86], [2016, 0.93], [2017, 1.02], [2018, 1.04], [2019, 1.12],
  [2020, 1.06], [2021, 1.19], [2022, 1.32], [2023, 1.37], [2024, 1.40]
];

// Age structure, 2024, % of total population (BPS).
const AGE_STRUCTURE = [
  { group: "0–14 years", share: 24.2 },
  { group: "15–24 years", share: 16.9 },
  { group: "25–54 years", share: 42.1 },
  { group: "55–64 years", share: 9.9 },
  { group: "65+ years", share: 6.9 }
];

// GDP by sector, 2024, % of GDP (BPS National Accounts) and value in US$bn.
const GDP_SECTORS = [
  { name: "Manufacturing", share: 18.98, value: 265.7 },
  { name: "Wholesale & retail trade", share: 12.86, value: 180.0 },
  { name: "Agriculture, forestry & fishing", share: 12.51, value: 175.1 },
  { name: "Construction", share: 9.95, value: 139.3 },
  { name: "Mining & quarrying", share: 8.30, value: 116.2 },
  { name: "Information & communication", share: 4.41, value: 61.7 },
  { name: "Financial & insurance services", share: 4.19, value: 58.7 },
  { name: "Transportation & storage", share: 3.98, value: 55.7 },
  { name: "Public administration", share: 3.28, value: 45.9 },
  { name: "Education", share: 3.13, value: 43.8 },
  { name: "Real estate", share: 2.71, value: 37.9 },
  { name: "Health & social work", share: 1.13, value: 15.8 },
  { name: "Other services & sectors", share: 14.57, value: 204.0 }
];

// Trade, 2024 (BPS).
const TRADE_2024 = {
  exports: 264.7, // US$ billion
  imports: 233.7, // US$ billion
  surplus: 31.0,  // US$ billion
  topExport: "Coal briquettes, palm oil, iron & steel",
  topPartner: "China (about 25% of exports)",
  source: "BPS — Statistics Indonesia, Foreign Trade Statistics 2024"
};

// Provinces: 2020 Census population (BPS) and land area in km² (BPS).
// The four newest Papuan provinces were created in 2022; their figures are
// the 2020-census totals of their constituent regencies, as published by BPS.
const PROVINCES = [
  { name: "West Java", pop: 48274162, area: 35378 },
  { name: "East Java", pop: 40665696, area: 47803 },
  { name: "Central Java", pop: 36516035, area: 32801 },
  { name: "North Sumatra", pop: 14799361, area: 72981 },
  { name: "Banten", pop: 11904562, area: 9663 },
  { name: "Jakarta", pop: 10562088, area: 664 },
  { name: "South Sulawesi", pop: 9073509, area: 46717 },
  { name: "Lampung", pop: 9007835, area: 34624 },
  { name: "South Sumatra", pop: 8467432, area: 91592 },
  { name: "Riau", pop: 6394087, area: 87023 },
  { name: "West Sumatra", pop: 5534472, area: 42013 },
  { name: "West Kalimantan", pop: 5414390, area: 147307 },
  { name: "East Nusa Tenggara", pop: 5325566, area: 48718 },
  { name: "West Nusa Tenggara", pop: 5320092, area: 18572 },
  { name: "Aceh", pop: 5274871, area: 57956 },
  { name: "Bali", pop: 4317404, area: 5780 },
  { name: "South Kalimantan", pop: 4073584, area: 38744 },
  { name: "East Kalimantan", pop: 3766039, area: 129067 },
  { name: "Yogyakarta", pop: 3668719, area: 3133 },
  { name: "Jambi", pop: 3548228, area: 50058 },
  { name: "Central Sulawesi", pop: 2985734, area: 61841 },
  { name: "Central Kalimantan", pop: 2670158, area: 153564 },
  { name: "Southeast Sulawesi", pop: 2624875, area: 38140 },
  { name: "North Sulawesi", pop: 2621923, area: 13892 },
  { name: "Riau Islands", pop: 2064717, area: 8202 },
  { name: "Bengkulu", pop: 2010670, area: 19919 },
  { name: "Maluku", pop: 1848923, area: 46914 },
  { name: "Highland Papua", pop: 1467000, area: 51213 },
  { name: "West Sulawesi", pop: 1419229, area: 16787 },
  { name: "Central Papua", pop: 1348000, area: 61073 },
  { name: "North Maluku", pop: 1282937, area: 31983 },
  { name: "Gorontalo", pop: 1171681, area: 11257 },
  { name: "Papua", pop: 1061000, area: 82680 },
  { name: "North Kalimantan", pop: 701814, area: 72567 },
  { name: "Southwest Papua", pop: 591000, area: 38820 },
  { name: "West Papua", pop: 542000, area: 39167 },
  { name: "South Papua", pop: 513000, area: 117849 },
  { name: "Bangka Belitung", pop: 1455678, area: 16424 }
];

// Share of national GDP by province, 2024, % (BPS, approximate).
const PROVINCE_GDP_SHARE = {
  "Jakarta": 17.5, "West Java": 14.4, "East Java": 14.1, "Central Java": 8.2,
  "Riau": 4.9, "East Kalimantan": 4.6, "North Sumatra": 4.4, "Banten": 3.9,
  "South Sumatra": 3.5, "South Sulawesi": 3.1
};

// Health and social indicators, latest available year.
const HEALTH = {
  stunting: { value: 19.8, unit: "% of children under 5", year: 2024, source: "Ministry of Health, SSGI 2024" },
  infantMortality: { value: 17, unit: "deaths per 1,000 live births", year: 2023, source: "UN IGME 2023" },
  maternalMortality: { value: 173, unit: "deaths per 100,000 live births", year: 2020, source: "UN Maternal Mortality Estimation Group 2020" },
  fertility: { value: 2.14, unit: "births per woman", year: 2024, source: "BPS / UN World Population Prospects 2024" },
  medianAge: { value: 30.5, unit: "years", year: 2024, source: "UN World Population Prospects 2024" },
  urbanShare: { value: 58.6, unit: "% of population in urban areas", year: 2024, source: "BPS — Statistics Indonesia" },
  internetUsers: { value: 221.6, unit: "million people online", year: 2024, source: "APJII Indonesian Internet Survey 2024" },
  internetPenetration: { value: 79.5, unit: "% of population", year: 2024, source: "APJII Indonesian Internet Survey 2024" }
};

// Key facts shown on the overview page.
const KEY_FACTS = [
  { label: "Total area", value: "1,904,569 km²", note: "Land area, BPS — the world's largest archipelago, 17,000+ islands" },
  { label: "Provinces", value: "38", note: "Provinces (provinsi), including 6 in the Papua region" },
  { label: "Regencies & cities", value: "514", note: "Regencies (kabupaten) and cities (kota), BPS 2024" },
  { label: "Official languages", value: "Indonesian", note: "Bahasa Indonesia; 700+ local languages spoken across the islands" },
  { label: "Time zones", value: "3", note: "WIB (UTC+7), WITA (UTC+8), WIT (UTC+9)" },
  { label: "World rank by population", value: "4th", note: "After India, China and the United States — UN 2024" }
];

const SOURCES = [
  { name: "BPS — Statistics Indonesia", urlText: "bps.go.id", about: "Indonesia's national statistical office: the Population Census, National Accounts, Labour Force Survey (Sakernas), poverty and price statistics. Most figures on this site come from BPS releases." },
  { name: "World Bank — World Development Indicators", urlText: "data.worldbank.org", about: "GDP, GDP per capita and other internationally comparable series, in current US dollars." },
  { name: "United Nations — World Population Prospects 2024", urlText: "population.un.org", about: "Median age, fertility and population projections used on the Population page." },
  { name: "UN IGME & UN Maternal Mortality Estimation Group", urlText: "childmortality.org", about: "Infant and maternal mortality estimates shown on the Health & Education page." },
  { name: "Ministry of Health — SSGI 2024", urlText: "kemkes.go.id", about: "Indonesian Nutrition Status Survey: the stunting prevalence figure." },
  { name: "APJII — Indonesian Internet Survey 2024", urlText: "apjii.or.id", about: "Internet users and penetration in Indonesia." }
];
