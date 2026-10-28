/* GEOSTRAT — extended datasets (nuclear, ports, cities, cables, AI, etc.) */

// ── Nuclear facilities ─────────────────────────────────────────────────
// kind: POWER | ENRICH | WEAPONS | RESEARCH | REPROCESS | TEST | HEAVYWATER
const NUCLEAR_META = {
  POWER:     { label: "POWER PLANT",   color: "#6aa8e0" },
  ENRICH:    { label: "ENRICHMENT",    color: "#e0704f" },
  WEAPONS:   { label: "WEAPONS",       color: "#d95448" },
  RESEARCH:  { label: "RESEARCH",      color: "#8fe07f" },
  REPROCESS: { label: "REPROCESSING",  color: "#d9a441" },
  TEST:      { label: "TEST SITE",     color: "#d070b0" },
  HEAVYWATER:{ label: "HEAVY WATER",   color: "#56b8b0" },
};

const NUCLEAR_SITES = [
  // Iran
  { name: "Natanz (FEP)",        kind: "ENRICH",    country: "Iran", coords: [51.72, 33.72], note: "Main uranium enrichment complex; repeatedly sabotaged/struck." },
  { name: "Fordow (FFEP)",       kind: "ENRICH",    country: "Iran", coords: [50.99, 34.88], note: "Deeply buried enrichment site near Qom." },
  { name: "Bushehr NPP",         kind: "POWER",     country: "Iran", coords: [50.89, 28.83], note: "Russia-built power reactor on the Gulf." },
  { name: "Arak (IR-40)",        kind: "HEAVYWATER",country: "Iran", coords: [49.24, 34.38], note: "Khondab heavy-water research reactor." },
  { name: "Isfahan (UCF)",       kind: "RESEARCH",  country: "Iran", coords: [51.77, 32.57], note: "Uranium conversion & fuel fabrication." },
  { name: "Tehran Research Rx",  kind: "RESEARCH",  country: "Iran", coords: [51.39, 35.74], note: "TRR; medical isotope reactor." },
  { name: "Parchin",             kind: "WEAPONS",   country: "Iran", coords: [51.77, 35.52], note: "Military site linked to past weapons work." },
  // Israel
  { name: "Dimona (Negev NRC)",  kind: "WEAPONS",   country: "Israel", coords: [35.14, 31.0], note: "Plutonium production; undeclared arsenal." },
  { name: "Soreq NRC",           kind: "RESEARCH",  country: "Israel", coords: [34.71, 31.75], note: "Research center, central Israel." },
  // Pakistan
  { name: "Kahuta (KRL)",        kind: "ENRICH",    country: "Pakistan", coords: [73.38, 33.62], note: "Primary uranium enrichment (A.Q. Khan)." },
  { name: "Khushab Complex",     kind: "WEAPONS",   country: "Pakistan", coords: [72.2, 32.03], note: "Plutonium production reactors." },
  { name: "Chashma NPP",         kind: "POWER",     country: "Pakistan", coords: [71.46, 32.39], note: "Chinese-built power reactors." },
  { name: "KANUPP (Karachi)",    kind: "POWER",     country: "Pakistan", coords: [66.79, 24.84], note: "Karachi coastal power plant." },
  // India
  { name: "BARC Trombay",        kind: "RESEARCH",  country: "India", coords: [72.93, 19.02], note: "Bhabha Atomic Research Centre, Mumbai." },
  { name: "Kudankulam NPP",      kind: "POWER",     country: "India", coords: [77.71, 8.17],  note: "Largest Indian NPP, Tamil Nadu." },
  { name: "Kalpakkam",           kind: "RESEARCH",  country: "India", coords: [80.16, 12.56], note: "Fast breeder & reprocessing." },
  { name: "Tarapur",             kind: "POWER",     country: "India", coords: [72.66, 19.83], note: "India's oldest power station." },
  { name: "Rawatbhata",          kind: "POWER",     country: "India", coords: [75.61, 24.87], note: "Rajasthan Atomic Power Station." },
  // North Korea
  { name: "Yongbyon",            kind: "WEAPONS",   country: "North Korea", coords: [125.75, 39.8], note: "Plutonium reactor & reprocessing hub." },
  { name: "Punggye-ri",          kind: "TEST",      country: "North Korea", coords: [129.08, 41.28], note: "Underground nuclear test site." },
  // China
  { name: "Lop Nur",             kind: "TEST",      country: "China", coords: [88.5, 41.5],   note: "Historic nuclear test range, Xinjiang." },
  { name: "Lanzhou Enrichment",  kind: "ENRICH",    country: "China", coords: [103.7, 36.06], note: "Uranium enrichment, Gansu." },
  { name: "Daya Bay NPP",        kind: "POWER",     country: "China", coords: [114.55, 22.6], note: "Guangdong power complex near Hong Kong." },
  { name: "Tianwan NPP",         kind: "POWER",     country: "China", coords: [119.46, 34.69], note: "Large power plant, Jiangsu." },
  // Russia
  { name: "Mayak",               kind: "REPROCESS", country: "Russia", coords: [60.8, 55.7],  note: "Reprocessing complex; 1957 Kyshtym disaster." },
  { name: "Seversk (SCC)",       kind: "ENRICH",    country: "Russia", coords: [84.88, 56.6], note: "Enrichment & weapons materials, Tomsk." },
  { name: "Sarov (VNIIEF)",      kind: "WEAPONS",   country: "Russia", coords: [43.32, 54.93], note: "Lead nuclear weapons design lab." },
  { name: "Novaya Zemlya",       kind: "TEST",      country: "Russia", coords: [54.5, 73.4],  note: "Arctic nuclear test site." },
  { name: "Zheleznogorsk",       kind: "REPROCESS", country: "Russia", coords: [93.53, 56.25], note: "Plutonium & reprocessing, Siberia." },
  // USA
  { name: "Los Alamos",          kind: "WEAPONS",   country: "United States", coords: [-106.3, 35.88], note: "Nuclear weapons design lab, New Mexico." },
  { name: "Oak Ridge (Y-12)",    kind: "WEAPONS",   country: "United States", coords: [-84.26, 36.02], note: "Enriched uranium & weapons components." },
  { name: "Hanford Site",        kind: "REPROCESS", country: "United States", coords: [-119.5, 46.55], note: "Former plutonium production, Washington." },
  { name: "Savannah River",      kind: "WEAPONS",   country: "United States", coords: [-81.65, 33.35], note: "Tritium & weapons materials, S. Carolina." },
  { name: "Pantex",              kind: "WEAPONS",   country: "United States", coords: [-101.56, 35.32], note: "Warhead assembly/disassembly, Texas." },
  { name: "Nevada Test Site",    kind: "TEST",      country: "United States", coords: [-116.05, 37.0], note: "Historic US nuclear test range." },
  { name: "Palo Verde NPP",      kind: "POWER",     country: "United States", coords: [-112.86, 33.39], note: "Largest US power plant, Arizona." },
  // France
  { name: "La Hague",            kind: "REPROCESS", country: "France", coords: [-1.88, 49.68], note: "Major spent-fuel reprocessing plant." },
  { name: "Tricastin",           kind: "ENRICH",    country: "France", coords: [4.73, 44.33], note: "Georges Besse enrichment + NPP." },
  { name: "Marcoule",            kind: "WEAPONS",   country: "France", coords: [4.71, 44.14], note: "Historic military plutonium site." },
  { name: "Cadarache",           kind: "RESEARCH",  country: "France", coords: [5.76, 43.69], note: "Research center; near ITER." },
  // UK
  { name: "Sellafield",          kind: "REPROCESS", country: "United Kingdom", coords: [-3.5, 54.42], note: "Reprocessing & waste site, Cumbria." },
  { name: "Aldermaston (AWE)",   kind: "WEAPONS",   country: "United Kingdom", coords: [-1.14, 51.37], note: "Warhead design & manufacture." },
  { name: "Capenhurst",          kind: "ENRICH",    country: "United Kingdom", coords: [-2.94, 53.27], note: "Urenco uranium enrichment." },
  // Japan
  { name: "Fukushima Daiichi",   kind: "POWER",     country: "Japan", coords: [141.03, 37.42], note: "Site of the 2011 meltdown; decommissioning." },
  { name: "Rokkasho",            kind: "REPROCESS", country: "Japan", coords: [141.37, 40.96], note: "Reprocessing & enrichment, Aomori." },
  { name: "Kashiwazaki-Kariwa",  kind: "POWER",     country: "Japan", coords: [138.6, 37.43], note: "World's largest NPP by capacity." },
  // Ukraine
  { name: "Zaporizhzhia NPP",    kind: "POWER",     country: "Ukraine", coords: [34.59, 47.51], note: "Largest NPP in Europe; Russian-occupied." },
  { name: "Chornobyl",           kind: "POWER",     country: "Ukraine", coords: [30.1, 51.39], note: "1986 disaster site; exclusion zone." },
  { name: "Rivne NPP",           kind: "POWER",     country: "Ukraine", coords: [25.89, 51.33], note: "Western Ukraine power reactors." },
  // Others
  { name: "Pelindaba",           kind: "RESEARCH",  country: "South Africa", coords: [27.81, -25.8], note: "Former weapons program; research center." },
  { name: "Barakah NPP",         kind: "POWER",     country: "UAE", coords: [52.2, 24.02], note: "First Arab-world power plant." },
  { name: "Akkuyu NPP",          kind: "POWER",     country: "Turkey", coords: [33.54, 36.14], note: "Rosatom-built, under construction." },
  { name: "Astravets NPP",       kind: "POWER",     country: "Belarus", coords: [26.09, 54.76], note: "Russian-built, near Lithuania." },
  { name: "Olkiluoto NPP",       kind: "POWER",     country: "Finland", coords: [21.44, 61.24], note: "EPR reactor; deep waste repository nearby." },
  { name: "Bruce NPP",           kind: "POWER",     country: "Canada", coords: [-81.6, 44.32], note: "One of the world's largest NPPs." },
  { name: "Angra NPP",           kind: "POWER",     country: "Brazil", coords: [-44.46, -23.01], note: "Brazil's only power reactors." },
  { name: "Atucha",              kind: "POWER",     country: "Argentina", coords: [-59.2, -33.97], note: "Argentine power reactors." },
  { name: "Kori NPP",            kind: "POWER",     country: "South Korea", coords: [129.29, 35.32], note: "Large reactor cluster near Busan." },
  { name: "El Dabaa NPP",        kind: "POWER",     country: "Egypt", coords: [28.48, 31.03], note: "Rosatom-built, under construction." },
  { name: "Rooppur NPP",         kind: "POWER",     country: "Bangladesh", coords: [89.05, 24.07], note: "First Bangladeshi power plant." },
  { name: "Semipalatinsk",       kind: "TEST",      country: "Kazakhstan", coords: [78.0, 50.12], note: "Former Soviet nuclear test polygon." },
];

// ── Radiation watch (elevated / monitored contamination zones) ─────────
const RADIATION_SITES = [
  { name: "Chornobyl Exclusion Zone", coords: [30.1, 51.39],  level: "HIGH",    note: "1986 disaster; 2,600 km² restricted zone." },
  { name: "Fukushima Daiichi",        coords: [141.03, 37.42],level: "ELEVATED",note: "Ongoing decommissioning; treated-water releases." },
  { name: "Zaporizhzhia NPP",         coords: [34.59, 47.51], level: "WATCH",   note: "Occupied plant; shelling & cooling-loss risk." },
  { name: "Mayak / Kyshtym",          coords: [60.8, 55.7],   level: "ELEVATED",note: "Legacy contamination, Techa River basin." },
  { name: "Hanford Site",             coords: [-119.5, 46.55],level: "ELEVATED",note: "Largest US radioactive waste cleanup." },
  { name: "Semipalatinsk Polygon",    coords: [78.0, 50.12],  level: "ELEVATED",note: "Residual contamination from 456 tests." },
  { name: "Marshall Islands (Bikini)",coords: [165.4, 11.6],  level: "ELEVATED",note: "US Pacific test legacy; Runit dome." },
  { name: "Fangataufa / Mururoa",     coords: [-138.9, -21.83],level: "WATCH",  note: "French Pacific test atolls." },
  { name: "Three Mile Island",        coords: [-76.72, 40.15],level: "WATCH",   note: "1979 partial meltdown; cleanup complete." },
  { name: "Goiânia",                  coords: [-49.25, -16.68],level: "WATCH",  note: "1987 Cs-137 orphan-source disaster." },
  { name: "Sellafield / Windscale",   coords: [-3.5, 54.42],  level: "ELEVATED",note: "1957 fire; reprocessing legacy waste." },
  { name: "Maralinga",                coords: [131.6, -30.17],level: "WATCH",   note: "British test site, South Australia." },
  { name: "Palomares",                coords: [-1.81, 37.24], level: "WATCH",   note: "1966 B-52 crash; plutonium contamination." },
  { name: "Church Rock",              coords: [-108.6, 35.64],level: "WATCH",   note: "1979 uranium mill tailings spill, NM." },
  { name: "Novaya Zemlya",            coords: [54.5, 73.4],   level: "WATCH",   note: "Soviet Arctic test range; Tsar Bomba." },
  { name: "Lop Nur",                  coords: [88.5, 41.5],   level: "WATCH",   note: "Chinese atmospheric/underground test site." },
];

// ── EPA RadNet monitoring stations (US fixed gamma monitors, curated subset
// of the ~130-station network; live near-real-time values are not exposed via a
// public API, so these mark the network's coverage, not per-station readings) ──
const RADNET_STATIONS = [
  { name: "Anchorage, AK", coords: [-149.9, 61.22] }, { name: "Juneau, AK", coords: [-134.42, 58.3] },
  { name: "Seattle, WA", coords: [-122.33, 47.61] }, { name: "Portland, OR", coords: [-122.68, 45.52] },
  { name: "San Francisco, CA", coords: [-122.42, 37.77] }, { name: "Los Angeles, CA", coords: [-118.24, 34.05] },
  { name: "Las Vegas, NV", coords: [-115.14, 36.17] }, { name: "Phoenix, AZ", coords: [-112.07, 33.45] },
  { name: "Salt Lake City, UT", coords: [-111.89, 40.76] }, { name: "Denver, CO", coords: [-104.99, 39.74] },
  { name: "Albuquerque, NM", coords: [-106.65, 35.08] }, { name: "Dallas, TX", coords: [-96.8, 32.78] },
  { name: "Houston, TX", coords: [-95.37, 29.76] }, { name: "Kansas City, MO", coords: [-94.58, 39.1] },
  { name: "Minneapolis, MN", coords: [-93.27, 44.98] }, { name: "Chicago, IL", coords: [-87.63, 41.88] },
  { name: "Detroit, MI", coords: [-83.05, 42.33] }, { name: "Atlanta, GA", coords: [-84.39, 33.75] },
  { name: "Miami, FL", coords: [-80.19, 25.76] }, { name: "Nashville, TN", coords: [-86.78, 36.16] },
  { name: "New Orleans, LA", coords: [-90.07, 29.95] }, { name: "Washington, DC", coords: [-77.04, 38.9] },
  { name: "New York, NY", coords: [-74.0, 40.71] }, { name: "Boston, MA", coords: [-71.06, 42.36] },
  { name: "Pittsburgh, PA", coords: [-79.99, 40.44] }, { name: "Richmond, VA", coords: [-77.44, 37.54] },
  { name: "Honolulu, HI", coords: [-157.86, 21.31] }, { name: "San Juan, PR", coords: [-66.11, 18.47] },
];

// ── IAEA-context research reactors & major irradiator facilities ───────
const IAEA_IRRADIATORS = [
  { name: "ILL High-Flux Reactor", country: "France", coords: [5.71, 45.21], note: "World's most intense neutron source, Grenoble." },
  { name: "ORNL HFIR", country: "United States", coords: [-84.31, 35.92], note: "High Flux Isotope Reactor, Oak Ridge." },
  { name: "NIST NCNR", country: "United States", coords: [-77.22, 39.13], note: "Center for Neutron Research, Gaithersburg." },
  { name: "MIT Reactor (MITR-II)", country: "United States", coords: [-71.09, 42.36], note: "University research reactor, Cambridge." },
  { name: "ANSTO OPAL", country: "Australia", coords: [150.98, -34.05], note: "Open-pool reactor; isotopes, Lucas Heights." },
  { name: "FRM II", country: "Germany", coords: [11.68, 48.27], note: "Heinz Maier-Leibnitz research reactor, Garching." },
  { name: "BR2", country: "Belgium", coords: [5.1, 51.22], note: "High-flux materials-test reactor, Mol." },
  { name: "HANARO", country: "South Korea", coords: [127.36, 36.43], note: "Multipurpose research reactor, Daejeon." },
  { name: "JRR-3", country: "Japan", coords: [140.61, 36.47], note: "Research reactor, Tokai-mura." },
  { name: "MARIA", country: "Poland", coords: [21.3, 52.14], note: "High-flux research reactor, Świerk." },
  { name: "SAFARI-1", country: "South Africa", coords: [27.81, -25.8], note: "Isotope-producing reactor, Pelindaba." },
  { name: "Dhruva", country: "India", coords: [72.93, 19.02], note: "Research/plutonium reactor, Trombay." },
  { name: "CARR", country: "China", coords: [116.15, 40.2], note: "China Advanced Research Reactor, Beijing." },
  { name: "RA-10 / Ezeiza", country: "Argentina", coords: [-58.52, -34.82], note: "Isotope research reactor complex." },
];

// ── Aircraft-carrier fleet bases & forward-operating locations ─────────
// Combatants run dark on AIS, so live carrier positions can't come from the
// ship layer. These are the (stable, factual) home fleet bases and forward
// bases of the world's carrier navies — strategic context, not live tracks.
// Live deployment whereabouts come from USNI's weekly Fleet & Marine Tracker
// (no API). Rides with the SHIPS layer.
const CARRIER_GROUPS = [
  { base: "Norfolk (NS Norfolk)",        navy: "US",     coords: [-76.33, 36.95], ships: "Atlantic CVNs — Ford, G.H.W. Bush, Truman, Eisenhower" },
  { base: "San Diego (NAS North Island)", navy: "US",    coords: [-117.22, 32.70], ships: "Pacific CVNs — Carl Vinson, T. Roosevelt, A. Lincoln, Nimitz" },
  { base: "Bremerton / Kitsap",          navy: "US",     coords: [-122.65, 47.56], ships: "Pacific CVN homeport & maintenance" },
  { base: "Yokosuka (forward-deployed)", navy: "US",     coords: [139.66, 35.29], ships: "7th Fleet forward carrier — USS George Washington" },
  { base: "Portsmouth",                  navy: "UK",     coords: [-1.09, 50.80],  ships: "HMS Queen Elizabeth, HMS Prince of Wales" },
  { base: "Toulon",                      navy: "France", coords: [5.90, 43.09],   ships: "Charles de Gaulle (nuclear CVN)" },
  { base: "Taranto",                     navy: "Italy",  coords: [17.24, 40.47],  ships: "ITS Cavour, ITS Trieste" },
  { base: "Yulin (Hainan)",              navy: "China",  coords: [109.50, 18.20], ships: "PLAN South Sea Fleet carrier base" },
  { base: "Qingdao",                     navy: "China",  coords: [120.38, 36.07], ships: "CNS Liaoning — North Sea Fleet" },
  { base: "Dalian",                      navy: "China",  coords: [121.63, 38.94], ships: "Carrier build/fit-out — Shandong, Fujian" },
  { base: "Severomorsk",                 navy: "Russia", coords: [33.42, 69.07],  ships: "Admiral Kuznetsov (long refit)" },
  { base: "Karwar (INS Kadamba)",        navy: "India",  coords: [74.12, 14.80],  ships: "INS Vikramaditya, INS Vikrant" },
];

// ── Major seaports ─────────────────────────────────────────────────────
const WORLD_PORTS = [
  { name: "Shanghai", country: "China", coords: [121.5, 31.23] },
  { name: "Ningbo-Zhoushan", country: "China", coords: [121.55, 29.87] },
  { name: "Shenzhen", country: "China", coords: [113.88, 22.55] },
  { name: "Guangzhou", country: "China", coords: [113.4, 23.09] },
  { name: "Qingdao", country: "China", coords: [120.3, 36.08] },
  { name: "Hong Kong", country: "China", coords: [114.16, 22.3] },
  { name: "Singapore", country: "Singapore", coords: [103.85, 1.26] },
  { name: "Busan", country: "South Korea", coords: [129.06, 35.1] },
  { name: "Kaohsiung", country: "Taiwan", coords: [120.3, 22.6] },
  { name: "Port Klang", country: "Malaysia", coords: [101.36, 3.0] },
  { name: "Tanjung Pelepas", country: "Malaysia", coords: [103.55, 1.36] },
  { name: "Laem Chabang", country: "Thailand", coords: [100.88, 13.08] },
  { name: "Tokyo Bay (Yokohama)", country: "Japan", coords: [139.68, 35.45] },
  { name: "Colombo", country: "Sri Lanka", coords: [79.84, 6.95] },
  { name: "JNPT / Mumbai", country: "India", coords: [72.95, 18.95] },
  { name: "Mundra", country: "India", coords: [69.7, 22.84] },
  { name: "Jebel Ali", country: "UAE", coords: [55.06, 25.01] },
  { name: "Bandar Abbas (Shahid Rajaee)", country: "Iran", coords: [56.06, 27.1] },
  { name: "Jeddah Islamic Port", country: "Saudi Arabia", coords: [39.15, 21.48] },
  { name: "Salalah", country: "Oman", coords: [54.0, 16.94] },
  { name: "Rotterdam", country: "Netherlands", coords: [4.13, 51.95] },
  { name: "Antwerp", country: "Belgium", coords: [4.4, 51.26] },
  { name: "Hamburg", country: "Germany", coords: [9.93, 53.54] },
  { name: "Piraeus", country: "Greece", coords: [23.63, 37.94] },
  { name: "Valencia", country: "Spain", coords: [-0.32, 39.44] },
  { name: "Algeciras", country: "Spain", coords: [-5.44, 36.13] },
  { name: "Felixstowe", country: "United Kingdom", coords: [1.33, 51.95] },
  { name: "Gioia Tauro", country: "Italy", coords: [15.9, 38.45] },
  { name: "Tanger Med", country: "Morocco", coords: [-5.5, 35.88] },
  { name: "Port Said", country: "Egypt", coords: [32.31, 31.25] },
  { name: "Durban", country: "South Africa", coords: [31.03, -29.87] },
  { name: "Mombasa", country: "Kenya", coords: [39.65, -4.06] },
  { name: "Lagos (Apapa)", country: "Nigeria", coords: [3.36, 6.44] },
  { name: "Los Angeles / Long Beach", country: "United States", coords: [-118.22, 33.75] },
  { name: "New York / NJ", country: "United States", coords: [-74.15, 40.66] },
  { name: "Savannah", country: "United States", coords: [-81.14, 32.08] },
  { name: "Houston", country: "United States", coords: [-95.06, 29.72] },
  { name: "Santos", country: "Brazil", coords: [-46.3, -23.96] },
  { name: "Manzanillo", country: "Mexico", coords: [-104.34, 19.05] },
  { name: "Colón", country: "Panama", coords: [-79.9, 9.36] },
  { name: "Vladivostok", country: "Russia", coords: [131.88, 43.09] },
  { name: "Novorossiysk", country: "Russia", coords: [37.78, 44.72] },
  { name: "St Petersburg", country: "Russia", coords: [30.23, 59.9] },
  { name: "Odesa", country: "Ukraine", coords: [30.73, 46.48] },
  { name: "Constanța", country: "Romania", coords: [28.66, 44.17] },
  // — additional major ports —
  { name: "Tianjin", country: "China", coords: [117.72, 38.98] },
  { name: "Xiamen", country: "China", coords: [118.08, 24.46] },
  { name: "Dalian", country: "China", coords: [121.63, 38.92] },
  { name: "Incheon", country: "South Korea", coords: [126.6, 37.46] },
  { name: "Ho Chi Minh (Cai Mep)", country: "Vietnam", coords: [107.03, 10.53] },
  { name: "Manila", country: "Philippines", coords: [120.96, 14.6] },
  { name: "Tanjung Priok (Jakarta)", country: "Indonesia", coords: [106.88, -6.1] },
  { name: "Chittagong", country: "Bangladesh", coords: [91.8, 22.31] },
  { name: "Chennai", country: "India", coords: [80.3, 13.1] },
  { name: "Sohar", country: "Oman", coords: [56.61, 24.51] },
  { name: "Duqm", country: "Oman", coords: [57.7, 19.66] },
  { name: "Aqaba", country: "Jordan", coords: [35.0, 29.52] },
  { name: "Haifa", country: "Israel", coords: [35.0, 32.83] },
  { name: "Beirut", country: "Lebanon", coords: [35.52, 33.9] },
  { name: "Izmit / Kocaeli", country: "Turkey", coords: [29.92, 40.76] },
  { name: "Marseille-Fos", country: "France", coords: [4.86, 43.4] },
  { name: "Genoa", country: "Italy", coords: [8.93, 44.4] },
  { name: "Barcelona", country: "Spain", coords: [2.16, 41.34] },
  { name: "Le Havre", country: "France", coords: [0.11, 49.48] },
  { name: "Gdańsk", country: "Poland", coords: [18.68, 54.4] },
  { name: "Gothenburg", country: "Sweden", coords: [11.87, 57.68] },
  { name: "Montreal", country: "Canada", coords: [-73.54, 45.55] },
  { name: "Vancouver", country: "Canada", coords: [-123.1, 49.29] },
  { name: "Oakland", country: "United States", coords: [-122.31, 37.8] },
  { name: "Seattle-Tacoma", country: "United States", coords: [-122.34, 47.57] },
  { name: "Charleston", country: "United States", coords: [-79.92, 32.78] },
  { name: "Balboa", country: "Panama", coords: [-79.56, 8.95] },
  { name: "Callao", country: "Peru", coords: [-77.13, -12.05] },
  { name: "Cartagena", country: "Colombia", coords: [-75.51, 10.4] },
  { name: "Buenos Aires", country: "Argentina", coords: [-58.37, -34.6] },
  { name: "Valparaíso", country: "Chile", coords: [-71.63, -33.04] },
  { name: "Melbourne", country: "Australia", coords: [144.92, -37.83] },
  { name: "Abidjan", country: "Côte d'Ivoire", coords: [-4.0, 5.28] },
  { name: "Dakar", country: "Senegal", coords: [-17.42, 14.68] },
  { name: "Luanda", country: "Angola", coords: [13.23, -8.78] },
];

// ── Important cities (capitals + major hubs) ───────────────────────────
// cap: capital
const WORLD_CITIES = [
  { name: "Washington", country: "United States", coords: [-77.04, 38.9], cap: true },
  { name: "New York", country: "United States", coords: [-74.0, 40.71] },
  { name: "Los Angeles", country: "United States", coords: [-118.24, 34.05] },
  { name: "Chicago", country: "United States", coords: [-87.63, 41.88] },
  { name: "Ottawa", country: "Canada", coords: [-75.7, 45.42], cap: true },
  { name: "Toronto", country: "Canada", coords: [-79.38, 43.65] },
  { name: "Mexico City", country: "Mexico", coords: [-99.13, 19.43], cap: true },
  { name: "Brasília", country: "Brazil", coords: [-47.93, -15.78], cap: true },
  { name: "São Paulo", country: "Brazil", coords: [-46.63, -23.55] },
  { name: "Buenos Aires", country: "Argentina", coords: [-58.38, -34.6], cap: true },
  { name: "Santiago", country: "Chile", coords: [-70.65, -33.45], cap: true },
  { name: "Lima", country: "Peru", coords: [-77.03, -12.05], cap: true },
  { name: "Bogotá", country: "Colombia", coords: [-74.07, 4.71], cap: true },
  { name: "Caracas", country: "Venezuela", coords: [-66.9, 10.48], cap: true },
  { name: "London", country: "United Kingdom", coords: [-0.13, 51.51], cap: true },
  { name: "Paris", country: "France", coords: [2.35, 48.86], cap: true },
  { name: "Berlin", country: "Germany", coords: [13.4, 52.52], cap: true },
  { name: "Madrid", country: "Spain", coords: [-3.7, 40.42], cap: true },
  { name: "Rome", country: "Italy", coords: [12.5, 41.9], cap: true },
  { name: "Amsterdam", country: "Netherlands", coords: [4.9, 52.37], cap: true },
  { name: "Brussels", country: "Belgium", coords: [4.35, 50.85], cap: true },
  { name: "Vienna", country: "Austria", coords: [16.37, 48.21], cap: true },
  { name: "Bern", country: "Switzerland", coords: [7.45, 46.95], cap: true },
  { name: "Warsaw", country: "Poland", coords: [21.01, 52.23], cap: true },
  { name: "Kyiv", country: "Ukraine", coords: [30.52, 50.45], cap: true },
  { name: "Moscow", country: "Russia", coords: [37.62, 55.75], cap: true },
  { name: "Stockholm", country: "Sweden", coords: [18.07, 59.33], cap: true },
  { name: "Oslo", country: "Norway", coords: [10.75, 59.91], cap: true },
  { name: "Helsinki", country: "Finland", coords: [24.94, 60.17], cap: true },
  { name: "Copenhagen", country: "Denmark", coords: [12.57, 55.68], cap: true },
  { name: "Athens", country: "Greece", coords: [23.73, 37.98], cap: true },
  { name: "Lisbon", country: "Portugal", coords: [-9.14, 38.72], cap: true },
  { name: "Ankara", country: "Turkey", coords: [32.86, 39.93], cap: true },
  { name: "Istanbul", country: "Turkey", coords: [28.98, 41.01] },
  { name: "Belgrade", country: "Serbia", coords: [20.46, 44.79], cap: true },
  { name: "Bucharest", country: "Romania", coords: [26.1, 44.43], cap: true },
  { name: "Cairo", country: "Egypt", coords: [31.24, 30.06], cap: true },
  { name: "Riyadh", country: "Saudi Arabia", coords: [46.72, 24.63], cap: true },
  { name: "Tehran", country: "Iran", coords: [51.39, 35.69], cap: true },
  { name: "Baghdad", country: "Iraq", coords: [44.36, 33.31], cap: true },
  { name: "Damascus", country: "Syria", coords: [36.29, 33.51], cap: true },
  { name: "Beirut", country: "Lebanon", coords: [35.5, 33.89], cap: true },
  { name: "Amman", country: "Jordan", coords: [35.94, 31.95], cap: true },
  { name: "Jerusalem", country: "Israel", coords: [35.22, 31.78], cap: true },
  { name: "Abu Dhabi", country: "UAE", coords: [54.37, 24.45], cap: true },
  { name: "Dubai", country: "UAE", coords: [55.27, 25.2] },
  { name: "Doha", country: "Qatar", coords: [51.53, 25.29], cap: true },
  { name: "Kuwait City", country: "Kuwait", coords: [47.98, 29.38], cap: true },
  { name: "Sanaa", country: "Yemen", coords: [44.21, 15.35], cap: true },
  { name: "Islamabad", country: "Pakistan", coords: [73.06, 33.68], cap: true },
  { name: "Kabul", country: "Afghanistan", coords: [69.18, 34.53], cap: true },
  { name: "New Delhi", country: "India", coords: [77.21, 28.61], cap: true },
  { name: "Mumbai", country: "India", coords: [72.88, 19.08] },
  { name: "Dhaka", country: "Bangladesh", coords: [90.41, 23.81], cap: true },
  { name: "Beijing", country: "China", coords: [116.4, 39.9], cap: true },
  { name: "Shanghai", country: "China", coords: [121.47, 31.23] },
  { name: "Pyongyang", country: "North Korea", coords: [125.75, 39.03], cap: true },
  { name: "Seoul", country: "South Korea", coords: [126.98, 37.57], cap: true },
  { name: "Tokyo", country: "Japan", coords: [139.69, 35.69], cap: true },
  { name: "Taipei", country: "Taiwan", coords: [121.56, 25.03], cap: true },
  { name: "Hanoi", country: "Vietnam", coords: [105.83, 21.03], cap: true },
  { name: "Bangkok", country: "Thailand", coords: [100.5, 13.76], cap: true },
  { name: "Jakarta", country: "Indonesia", coords: [106.83, -6.21], cap: true },
  { name: "Manila", country: "Philippines", coords: [120.98, 14.6], cap: true },
  { name: "Kuala Lumpur", country: "Malaysia", coords: [101.69, 3.14], cap: true },
  { name: "Canberra", country: "Australia", coords: [149.13, -35.28], cap: true },
  { name: "Sydney", country: "Australia", coords: [151.21, -33.87] },
  { name: "Wellington", country: "New Zealand", coords: [174.78, -41.29], cap: true },
  { name: "Pretoria", country: "South Africa", coords: [28.19, -25.75], cap: true },
  { name: "Nairobi", country: "Kenya", coords: [36.82, -1.29], cap: true },
  { name: "Addis Ababa", country: "Ethiopia", coords: [38.75, 9.02], cap: true },
  { name: "Lagos", country: "Nigeria", coords: [3.38, 6.52] },
  { name: "Abuja", country: "Nigeria", coords: [7.5, 9.06], cap: true },
  { name: "Kinshasa", country: "DR Congo", coords: [15.31, -4.32], cap: true },
  { name: "Khartoum", country: "Sudan", coords: [32.53, 15.5], cap: true },
  { name: "Algiers", country: "Algeria", coords: [3.06, 36.75], cap: true },
  { name: "Rabat", country: "Morocco", coords: [-6.85, 34.02], cap: true },
  { name: "Tunis", country: "Tunisia", coords: [10.18, 36.81], cap: true },
  { name: "Tripoli", country: "Libya", coords: [13.19, 32.89], cap: true },
  { name: "Astana", country: "Kazakhstan", coords: [71.43, 51.13], cap: true },
  { name: "Tashkent", country: "Uzbekistan", coords: [69.24, 41.31], cap: true },
  { name: "Baku", country: "Azerbaijan", coords: [49.87, 40.41], cap: true },
  { name: "Tbilisi", country: "Georgia", coords: [44.83, 41.72], cap: true },
  { name: "Yerevan", country: "Armenia", coords: [44.51, 40.18], cap: true },
  // — remaining world capitals & major cities (comprehensive) —
  { name: "Dublin", country: "Ireland", coords: [-6.26, 53.35], cap: true },
  { name: "Reykjavik", country: "Iceland", coords: [-21.94, 64.15], cap: true },
  { name: "Prague", country: "Czechia", coords: [14.44, 50.08], cap: true },
  { name: "Budapest", country: "Hungary", coords: [19.04, 47.5], cap: true },
  { name: "Bratislava", country: "Slovakia", coords: [17.11, 48.15], cap: true },
  { name: "Ljubljana", country: "Slovenia", coords: [14.51, 46.06], cap: true },
  { name: "Zagreb", country: "Croatia", coords: [15.98, 45.81], cap: true },
  { name: "Sarajevo", country: "Bosnia", coords: [18.41, 43.86], cap: true },
  { name: "Podgorica", country: "Montenegro", coords: [19.26, 42.44], cap: true },
  { name: "Skopje", country: "North Macedonia", coords: [21.43, 41.99], cap: true },
  { name: "Tirana", country: "Albania", coords: [19.82, 41.33], cap: true },
  { name: "Pristina", country: "Kosovo", coords: [21.17, 42.66], cap: true },
  { name: "Sofia", country: "Bulgaria", coords: [23.32, 42.7], cap: true },
  { name: "Chisinau", country: "Moldova", coords: [28.86, 47.01], cap: true },
  { name: "Minsk", country: "Belarus", coords: [27.57, 53.9], cap: true },
  { name: "Vilnius", country: "Lithuania", coords: [25.28, 54.69], cap: true },
  { name: "Riga", country: "Latvia", coords: [24.11, 56.95], cap: true },
  { name: "Tallinn", country: "Estonia", coords: [24.75, 59.44], cap: true },
  { name: "Luxembourg", country: "Luxembourg", coords: [6.13, 49.61], cap: true },
  { name: "Valletta", country: "Malta", coords: [14.51, 35.9], cap: true },
  { name: "Nicosia", country: "Cyprus", coords: [33.36, 35.17], cap: true },
  { name: "Manama", country: "Bahrain", coords: [50.59, 26.23], cap: true },
  { name: "Muscat", country: "Oman", coords: [58.41, 23.59], cap: true },
  { name: "Ashgabat", country: "Turkmenistan", coords: [58.38, 37.95], cap: true },
  { name: "Bishkek", country: "Kyrgyzstan", coords: [74.6, 42.87], cap: true },
  { name: "Dushanbe", country: "Tajikistan", coords: [68.78, 38.56], cap: true },
  { name: "Ulaanbaatar", country: "Mongolia", coords: [106.92, 47.89], cap: true },
  { name: "Colombo", country: "Sri Lanka", coords: [79.86, 6.93], cap: true },
  { name: "Kathmandu", country: "Nepal", coords: [85.32, 27.72], cap: true },
  { name: "Thimphu", country: "Bhutan", coords: [89.64, 27.47], cap: true },
  { name: "Naypyidaw", country: "Myanmar", coords: [96.13, 19.76], cap: true },
  { name: "Yangon", country: "Myanmar", coords: [96.16, 16.87] },
  { name: "Vientiane", country: "Laos", coords: [102.6, 17.97], cap: true },
  { name: "Phnom Penh", country: "Cambodia", coords: [104.92, 11.56], cap: true },
  { name: "Bandar Seri Begawan", country: "Brunei", coords: [114.94, 4.9], cap: true },
  { name: "Dili", country: "Timor-Leste", coords: [125.58, -8.56], cap: true },
  { name: "Karachi", country: "Pakistan", coords: [67.01, 24.86] },
  { name: "Lahore", country: "Pakistan", coords: [74.33, 31.55] },
  { name: "Kolkata", country: "India", coords: [88.36, 22.57] },
  { name: "Bengaluru", country: "India", coords: [77.59, 12.97] },
  { name: "Chennai", country: "India", coords: [80.27, 13.08] },
  { name: "Guangzhou", country: "China", coords: [113.26, 23.13] },
  { name: "Chengdu", country: "China", coords: [104.07, 30.57] },
  { name: "Osaka", country: "Japan", coords: [135.5, 34.69] },
  { name: "Guatemala City", country: "Guatemala", coords: [-90.51, 14.63], cap: true },
  { name: "San Salvador", country: "El Salvador", coords: [-89.19, 13.69], cap: true },
  { name: "Tegucigalpa", country: "Honduras", coords: [-87.19, 14.07], cap: true },
  { name: "Managua", country: "Nicaragua", coords: [-86.25, 12.11], cap: true },
  { name: "San José", country: "Costa Rica", coords: [-84.09, 9.93], cap: true },
  { name: "Panama City", country: "Panama", coords: [-79.52, 8.98], cap: true },
  { name: "Havana", country: "Cuba", coords: [-82.38, 23.11], cap: true },
  { name: "Kingston", country: "Jamaica", coords: [-76.79, 17.97], cap: true },
  { name: "Santo Domingo", country: "Dominican Republic", coords: [-69.93, 18.49], cap: true },
  { name: "Port-au-Prince", country: "Haiti", coords: [-72.34, 18.55], cap: true },
  { name: "Quito", country: "Ecuador", coords: [-78.47, -0.18], cap: true },
  { name: "La Paz", country: "Bolivia", coords: [-68.15, -16.5], cap: true },
  { name: "Asunción", country: "Paraguay", coords: [-57.58, -25.29], cap: true },
  { name: "Montevideo", country: "Uruguay", coords: [-56.16, -34.9], cap: true },
  { name: "Georgetown", country: "Guyana", coords: [-58.16, 6.8], cap: true },
  { name: "Paramaribo", country: "Suriname", coords: [-55.17, 5.85], cap: true },
  { name: "Rio de Janeiro", country: "Brazil", coords: [-43.2, -22.91] },
  { name: "Accra", country: "Ghana", coords: [-0.19, 5.6], cap: true },
  { name: "Abidjan", country: "Côte d'Ivoire", coords: [-4.02, 5.35] },
  { name: "Dakar", country: "Senegal", coords: [-17.44, 14.72], cap: true },
  { name: "Bamako", country: "Mali", coords: [-8.0, 12.65], cap: true },
  { name: "Ouagadougou", country: "Burkina Faso", coords: [-1.53, 12.37], cap: true },
  { name: "Niamey", country: "Niger", coords: [2.11, 13.51], cap: true },
  { name: "N'Djamena", country: "Chad", coords: [15.05, 12.11], cap: true },
  { name: "Bangui", country: "Central African Republic", coords: [18.56, 4.36], cap: true },
  { name: "Yaoundé", country: "Cameroon", coords: [11.52, 3.85], cap: true },
  { name: "Libreville", country: "Gabon", coords: [9.45, 0.42], cap: true },
  { name: "Brazzaville", country: "Congo", coords: [15.28, -4.27], cap: true },
  { name: "Luanda", country: "Angola", coords: [13.23, -8.84], cap: true },
  { name: "Lusaka", country: "Zambia", coords: [28.32, -15.39], cap: true },
  { name: "Harare", country: "Zimbabwe", coords: [31.05, -17.83], cap: true },
  { name: "Maputo", country: "Mozambique", coords: [32.57, -25.97], cap: true },
  { name: "Lilongwe", country: "Malawi", coords: [33.79, -13.98], cap: true },
  { name: "Dodoma", country: "Tanzania", coords: [35.75, -6.16], cap: true },
  { name: "Dar es Salaam", country: "Tanzania", coords: [39.28, -6.82] },
  { name: "Kampala", country: "Uganda", coords: [32.58, 0.35], cap: true },
  { name: "Kigali", country: "Rwanda", coords: [30.06, -1.94], cap: true },
  { name: "Bujumbura", country: "Burundi", coords: [29.36, -3.38], cap: true },
  { name: "Juba", country: "South Sudan", coords: [31.58, 4.85], cap: true },
  { name: "Asmara", country: "Eritrea", coords: [38.93, 15.34], cap: true },
  { name: "Djibouti", country: "Djibouti", coords: [43.15, 11.59], cap: true },
  { name: "Mogadishu", country: "Somalia", coords: [45.34, 2.04], cap: true },
  { name: "Antananarivo", country: "Madagascar", coords: [47.52, -18.88], cap: true },
  { name: "Windhoek", country: "Namibia", coords: [17.08, -22.56], cap: true },
  { name: "Gaborone", country: "Botswana", coords: [25.91, -24.65], cap: true },
  { name: "Freetown", country: "Sierra Leone", coords: [-13.23, 8.48], cap: true },
  { name: "Monrovia", country: "Liberia", coords: [-10.8, 6.3], cap: true },
  { name: "Conakry", country: "Guinea", coords: [-13.7, 9.64], cap: true },
  { name: "Banjul", country: "Gambia", coords: [-16.58, 13.45], cap: true },
  { name: "Nouakchott", country: "Mauritania", coords: [-15.98, 18.08], cap: true },
  { name: "Lomé", country: "Togo", coords: [1.22, 6.13], cap: true },
  { name: "Cotonou", country: "Benin", coords: [2.42, 6.37] },
  { name: "Cape Town", country: "South Africa", coords: [18.42, -33.92] },
  { name: "Johannesburg", country: "South Africa", coords: [28.05, -26.2] },
  { name: "Casablanca", country: "Morocco", coords: [-7.59, 33.57] },
  { name: "Port Moresby", country: "Papua New Guinea", coords: [147.18, -9.44], cap: true },
  { name: "Suva", country: "Fiji", coords: [178.44, -18.14], cap: true },
  // — additional major/second cities —
  { name: "Houston", country: "United States", coords: [-95.37, 29.76] },
  { name: "Miami", country: "United States", coords: [-80.19, 25.76] },
  { name: "San Francisco", country: "United States", coords: [-122.42, 37.77] },
  { name: "Seattle", country: "United States", coords: [-122.33, 47.61] },
  { name: "Atlanta", country: "United States", coords: [-84.39, 33.75] },
  { name: "Dallas", country: "United States", coords: [-96.8, 32.78] },
  { name: "Vancouver", country: "Canada", coords: [-123.12, 49.28] },
  { name: "Guadalajara", country: "Mexico", coords: [-103.35, 20.66] },
  { name: "Monterrey", country: "Mexico", coords: [-100.32, 25.69] },
  { name: "Medellín", country: "Colombia", coords: [-75.56, 6.25] },
  { name: "Guayaquil", country: "Ecuador", coords: [-79.9, -2.19] },
  { name: "Belo Horizonte", country: "Brazil", coords: [-43.94, -19.92] },
  { name: "Porto Alegre", country: "Brazil", coords: [-51.23, -30.03] },
  { name: "Recife", country: "Brazil", coords: [-34.88, -8.05] },
  { name: "Córdoba", country: "Argentina", coords: [-64.19, -31.42] },
  { name: "Manchester", country: "United Kingdom", coords: [-2.24, 53.48] },
  { name: "Munich", country: "Germany", coords: [11.58, 48.14] },
  { name: "Hamburg", country: "Germany", coords: [9.99, 53.55] },
  { name: "Frankfurt", country: "Germany", coords: [8.68, 50.11] },
  { name: "Milan", country: "Italy", coords: [9.19, 45.46] },
  { name: "Naples", country: "Italy", coords: [14.27, 40.85] },
  { name: "Barcelona", country: "Spain", coords: [2.17, 41.39] },
  { name: "Lyon", country: "France", coords: [4.83, 45.76] },
  { name: "Marseille", country: "France", coords: [5.37, 43.3] },
  { name: "Rotterdam", country: "Netherlands", coords: [4.48, 51.92] },
  { name: "Kraków", country: "Poland", coords: [19.94, 50.06] },
  { name: "Kharkiv", country: "Ukraine", coords: [36.23, 49.99] },
  { name: "Lviv", country: "Ukraine", coords: [24.03, 49.84] },
  { name: "St Petersburg", country: "Russia", coords: [30.34, 59.93] },
  { name: "Novosibirsk", country: "Russia", coords: [82.92, 55.03] },
  { name: "Yekaterinburg", country: "Russia", coords: [60.6, 56.84] },
  { name: "Vladivostok", country: "Russia", coords: [131.89, 43.12] },
  { name: "Izmir", country: "Turkey", coords: [27.14, 38.42] },
  { name: "Mashhad", country: "Iran", coords: [59.61, 36.31] },
  { name: "Isfahan", country: "Iran", coords: [51.68, 32.65] },
  { name: "Tabriz", country: "Iran", coords: [46.29, 38.08] },
  { name: "Shiraz", country: "Iran", coords: [52.53, 29.59] },
  { name: "Basra", country: "Iraq", coords: [47.78, 30.51] },
  { name: "Mosul", country: "Iraq", coords: [43.12, 36.34] },
  { name: "Erbil", country: "Iraq", coords: [44.01, 36.19] },
  { name: "Aleppo", country: "Syria", coords: [37.16, 36.2] },
  { name: "Jeddah", country: "Saudi Arabia", coords: [39.2, 21.49] },
  { name: "Alexandria", country: "Egypt", coords: [29.92, 31.2] },
  { name: "Casablanca", country: "Morocco", coords: [-7.59, 33.57] },
  { name: "Peshawar", country: "Pakistan", coords: [71.58, 34.01] },
  { name: "Faisalabad", country: "Pakistan", coords: [73.08, 31.42] },
  { name: "Hyderabad", country: "India", coords: [78.49, 17.39] },
  { name: "Ahmedabad", country: "India", coords: [72.57, 23.03] },
  { name: "Pune", country: "India", coords: [73.86, 18.52] },
  { name: "Lucknow", country: "India", coords: [80.95, 26.85] },
  { name: "Shenzhen", country: "China", coords: [114.06, 22.54] },
  { name: "Wuhan", country: "China", coords: [114.31, 30.59] },
  { name: "Xi'an", country: "China", coords: [108.94, 34.34] },
  { name: "Chongqing", country: "China", coords: [106.55, 29.56] },
  { name: "Harbin", country: "China", coords: [126.66, 45.75] },
  { name: "Busan", country: "South Korea", coords: [129.08, 35.18] },
  { name: "Nagoya", country: "Japan", coords: [136.91, 35.18] },
  { name: "Sapporo", country: "Japan", coords: [141.35, 43.06] },
  { name: "Fukuoka", country: "Japan", coords: [130.4, 33.59] },
  { name: "Surabaya", country: "Indonesia", coords: [112.75, -7.26] },
  { name: "Medan", country: "Indonesia", coords: [98.68, 3.6] },
  { name: "Cebu", country: "Philippines", coords: [123.89, 10.32] },
  { name: "Da Nang", country: "Vietnam", coords: [108.2, 16.05] },
  { name: "Chiang Mai", country: "Thailand", coords: [98.99, 18.79] },
  { name: "Perth", country: "Australia", coords: [115.86, -31.95] },
  { name: "Brisbane", country: "Australia", coords: [153.03, -27.47] },
  { name: "Auckland", country: "New Zealand", coords: [174.76, -36.85] },
  { name: "Durban", country: "South Africa", coords: [31.03, -29.86] },
  { name: "Kano", country: "Nigeria", coords: [8.52, 12.0] },
  { name: "Mombasa", country: "Kenya", coords: [39.66, -4.04] },
  { name: "Benghazi", country: "Libya", coords: [20.07, 32.12] },
  { name: "Almaty", country: "Kazakhstan", coords: [76.89, 43.24] },
];

// ── AI / hyperscale data centers ───────────────────────────────────────
const DATA_CENTERS = [
  { name: "Ashburn 'Data Center Alley'", op: "MULTI", country: "United States", coords: [-77.48, 39.02], note: "World's densest data-center hub, Virginia." },
  { name: "Santa Clara / Silicon Valley", op: "MULTI", country: "United States", coords: [-121.95, 37.35], note: "Core Bay Area compute cluster." },
  { name: "The Dalles", op: "GOOGLE", country: "United States", coords: [-121.18, 45.6], note: "Google flagship campus, Oregon." },
  { name: "Council Bluffs", op: "GOOGLE", country: "United States", coords: [-95.87, 41.26], note: "Large Google/ML campus, Iowa." },
  { name: "Prineville", op: "META", country: "United States", coords: [-120.83, 44.3], note: "Meta AI datacenter, Oregon." },
  { name: "Colossus (Memphis)", op: "XAI", country: "United States", coords: [-90.02, 35.06], note: "xAI's giant GPU supercluster." },
  { name: "Phoenix / Goodyear", op: "MULTI", country: "United States", coords: [-112.36, 33.44], note: "Fast-growing SW US compute." },
  { name: "Dublin", op: "MULTI", country: "Ireland", coords: [-6.26, 53.35], note: "Europe's largest DC cluster." },
  { name: "Slough / London", op: "MULTI", country: "United Kingdom", coords: [-0.59, 51.51], note: "Primary UK availability zone." },
  { name: "Frankfurt", op: "MULTI", country: "Germany", coords: [8.68, 50.11], note: "Continental Europe interconnect hub." },
  { name: "Amsterdam", op: "MULTI", country: "Netherlands", coords: [4.9, 52.31], note: "Major EU exchange & DC region." },
  { name: "Luleå", op: "META", country: "Sweden", coords: [22.15, 65.62], note: "Meta Arctic datacenter." },
  { name: "Singapore", op: "MULTI", country: "Singapore", coords: [103.7, 1.35], note: "SE Asia cloud gateway." },
  { name: "Tokyo (Inzai)", op: "MULTI", country: "Japan", coords: [140.15, 35.83], note: "Japan's core DC belt." },
  { name: "Mumbai", op: "MULTI", country: "India", coords: [72.95, 19.1], note: "India's largest cloud region." },
  { name: "Zhangjiakou", op: "ALIBABA", country: "China", coords: [114.88, 40.82], note: "North China hyperscale cluster." },
  { name: "Guizhou (Gui'an)", op: "MULTI", country: "China", coords: [106.5, 26.4], note: "China's 'big-data valley'." },
  { name: "Hohhot / Ulanqab", op: "MULTI", country: "China", coords: [111.75, 40.85], note: "Inner Mongolia AI compute base." },
  { name: "G42 (Abu Dhabi)", op: "G42", country: "UAE", coords: [54.4, 24.45], note: "Gulf AI compute champion." },
  { name: "Stargate Abilene", op: "OPENAI/ORACLE", country: "United States", coords: [-99.73, 32.45], note: "First Stargate AI campus (OpenAI, Oracle, Crusoe), Texas." },
  { name: "Hyperion (Richland Parish)", op: "META", country: "United States", coords: [-91.7, 32.4], note: "Meta's multi-gigawatt AI campus, Louisiana." },
  { name: "Prometheus (New Albany)", op: "META", country: "United States", coords: [-82.8, 40.08], note: "Meta 1 GW AI cluster in the Columbus, Ohio hub (also AWS, Google)." },
  { name: "Fairwater (Mount Pleasant)", op: "MICROSOFT", country: "United States", coords: [-87.9, 42.7], note: "Microsoft's flagship AI datacenter, Wisconsin." },
  { name: "Project Rainier (New Carlisle)", op: "AMAZON", country: "United States", coords: [-86.5, 41.7], note: "AWS Trainium supercluster built for Anthropic, Indiana." },
  { name: "Dallas–Fort Worth", op: "MULTI", country: "United States", coords: [-96.95, 32.85], note: "Second-largest US colocation market." },
  { name: "Chicago / Elk Grove", op: "MULTI", country: "United States", coords: [-87.97, 42], note: "Midwest interconnect and trading hub." },
  { name: "Atlanta", op: "MULTI", country: "United States", coords: [-84.39, 33.75], note: "Fast-growing Southeast AI market." },
  { name: "Hillsboro", op: "MULTI", country: "United States", coords: [-122.99, 45.52], note: "Oregon hub fed by Pacific cable landings." },
  { name: "Quincy", op: "MULTI", country: "United States", coords: [-119.85, 47.23], note: "Cheap hydro power: Microsoft, Yahoo and others, Washington." },
  { name: "Reno / Tahoe-Reno", op: "MULTI", country: "United States", coords: [-119.45, 39.53], note: "Switch Citadel and Google sites, Nevada." },
  { name: "Utah Data Center (Bluffdale)", op: "NSA", country: "United States", coords: [-111.93, 40.43], note: "NSA's signals-intelligence storage complex." },
  { name: "New York / New Jersey", op: "MULTI", country: "United States", coords: [-74.07, 40.79], note: "Secaucus and Manhattan: finance and trading compute." },
  { name: "Montréal / Québec", op: "MULTI", country: "Canada", coords: [-73.6, 45.5], note: "Hydro-powered Canadian cloud region." },
  { name: "Toronto", op: "MULTI", country: "Canada", coords: [-79.4, 43.7], note: "Canada's largest data-center market." },
  { name: "Querétaro", op: "MULTI", country: "Mexico", coords: [-100.39, 20.59], note: "Mexico's hyperscale cloud region." },
  { name: "São Paulo (Barueri)", op: "MULTI", country: "Brazil", coords: [-46.88, -23.5], note: "Latin America's biggest cloud hub." },
  { name: "Santiago", op: "MULTI", country: "Chile", coords: [-70.65, -33.45], note: "Southern Cone cloud region." },
  { name: "Paris", op: "MULTI", country: "France", coords: [2.35, 48.85], note: "France's core cloud and AI cluster." },
  { name: "Marseille", op: "MULTI", country: "France", coords: [5.37, 43.3], note: "Mediterranean cable-landing hub for Africa, Middle East and Asia." },
  { name: "Madrid", op: "MULTI", country: "Spain", coords: [-3.7, 40.4], note: "Iberia's main cloud region." },
  { name: "Sines (Start Campus)", op: "MULTI", country: "Portugal", coords: [-8.87, 37.95], note: "Atlantic cable-landing AI campus." },
  { name: "Milan", op: "MULTI", country: "Italy", coords: [9.19, 45.46], note: "Italy's cloud region." },
  { name: "Zurich", op: "MULTI", country: "Switzerland", coords: [8.55, 47.37], note: "Swiss financial and sovereign cloud." },
  { name: "Stockholm", op: "MULTI", country: "Sweden", coords: [18.07, 59.33], note: "Nordic cloud region." },
  { name: "Hamina", op: "GOOGLE", country: "Finland", coords: [27.2, 60.57], note: "Google's seawater-cooled site." },
  { name: "Odense", op: "META", country: "Denmark", coords: [10.39, 55.4], note: "Meta datacenter on Funen." },
  { name: "Viborg", op: "APPLE", country: "Denmark", coords: [9.4, 56.45], note: "Apple's renewable-powered datacenter." },
  { name: "Keflavík", op: "MULTI", country: "Iceland", coords: [-22.6, 63.98], note: "Geothermal-powered HPC and crypto sites." },
  { name: "Warsaw", op: "MULTI", country: "Poland", coords: [21, 52.23], note: "Central and Eastern Europe cloud region." },
  { name: "Moscow", op: "MULTI", country: "Russia", coords: [37.6, 55.75], note: "Yandex and Russian state cloud, cut off from Western hyperscalers." },
  { name: "Riyadh (HUMAIN)", op: "HUMAIN", country: "Saudi Arabia", coords: [46.7, 24.7], note: "Saudi PIF's AI champion; multi-gigawatt build-out." },
  { name: "Dammam", op: "MULTI", country: "Saudi Arabia", coords: [50.1, 26.4], note: "Eastern Province cloud region." },
  { name: "Dubai", op: "MULTI", country: "UAE", coords: [55.27, 25.2], note: "Gulf colocation and cloud hub." },
  { name: "Doha", op: "MULTI", country: "Qatar", coords: [51.53, 25.29], note: "Qatar cloud region." },
  { name: "Bahrain", op: "AMAZON", country: "Bahrain", coords: [50.58, 26.2], note: "First AWS region in the Middle East." },
  { name: "Tel Aviv", op: "MULTI", country: "Israel", coords: [34.8, 32.08], note: "Israel cloud region (Project Nimbus)." },
  { name: "Johor (Kulai / Sedenak)", op: "MULTI", country: "Malaysia", coords: [103.6, 1.65], note: "Southeast Asia's fastest AI build-out, beside Singapore." },
  { name: "Cyberjaya", op: "MULTI", country: "Malaysia", coords: [101.65, 2.92], note: "Kuala Lumpur's data-center zone." },
  { name: "Jakarta", op: "MULTI", country: "Indonesia", coords: [106.85, -6.2], note: "Indonesia's cloud region." },
  { name: "Hong Kong", op: "MULTI", country: "China", coords: [114.17, 22.32], note: "Gateway between China and global networks." },
  { name: "Shanghai", op: "MULTI", country: "China", coords: [121.47, 31.23], note: "East China cloud cluster." },
  { name: "Beijing", op: "MULTI", country: "China", coords: [116.4, 39.9], note: "North China cloud and government compute." },
  { name: "Ningxia (Zhongwei)", op: "MULTI", country: "China", coords: [105.18, 37.5], note: "'East Data, West Compute' hub; AWS China region." },
  { name: "Taipei", op: "MULTI", country: "Taiwan", coords: [121.56, 25.03], note: "Taiwan cloud region next to the chip makers." },
  { name: "Seoul", op: "MULTI", country: "South Korea", coords: [126.98, 37.57], note: "Korea's cloud region." },
  { name: "Osaka", op: "MULTI", country: "Japan", coords: [135.5, 34.69], note: "Japan's second cloud region." },
  { name: "Chennai", op: "MULTI", country: "India", coords: [80.27, 13.08], note: "India's cable-landing and DC hub." },
  { name: "Hyderabad", op: "MULTI", country: "India", coords: [78.47, 17.38], note: "AWS and Microsoft regions." },
  { name: "Sydney", op: "MULTI", country: "Australia", coords: [151.2, -33.87], note: "Australia's main cloud region." },
  { name: "Melbourne", op: "MULTI", country: "Australia", coords: [144.96, -37.81], note: "Australia's second region." },
  { name: "Johannesburg", op: "MULTI", country: "South Africa", coords: [28.05, -26.2], note: "Africa's largest data-center market." },
  { name: "Cape Town", op: "MULTI", country: "South Africa", coords: [18.42, -33.92], note: "Cable landings and cloud regions." },
  { name: "Lagos", op: "MULTI", country: "Nigeria", coords: [3.4, 6.45], note: "West Africa's data-center hub." },
  { name: "Nairobi", op: "MULTI", country: "Kenya", coords: [36.82, -1.29], note: "East Africa's connectivity hub." },
  { name: "Cairo", op: "MULTI", country: "Egypt", coords: [31.24, 30.04], note: "Where most Europe–Asia cables cross land." },
];

// ── Undersea communication cables (approximate trunk routes) ───────────
const UNDERSEA_CABLES = [
  { name: "MAREA", note: "Virginia Beach ↔ Bilbao; high-capacity transatlantic.",
    waypoints: [[-75.98,36.85],[-45.0,40.0],[-15.0,43.0],[-2.9,43.4]] },
  { name: "Grace Hopper", note: "New York ↔ UK/Spain (Google).",
    waypoints: [[-73.0,40.6],[-30.0,46.0],[-8.0,50.0],[-5.5,50.1]] },
  { name: "2Africa", note: "45,000 km ring around Africa — Europe/ME/Africa.",
    waypoints: [[-0.1,51.5],[-9.5,38.7],[-17.5,14.7],[8.7,4.4],[18.4,-33.9],[39.7,-4.05],[43.15,11.6],[32.3,29.9],[35.5,33.9]] },
  { name: "SEA-ME-WE 6", note: "Singapore ↔ Marseille via S.Asia & ME.",
    waypoints: [[103.85,1.28],[80.0,7.0],[68.0,17.0],[43.4,12.6],[32.35,30.5],[5.36,43.3]] },
  { name: "FLAG / FEA", note: "UK ↔ Japan legacy Eurasia trunk.",
    waypoints: [[-3.5,50.1],[-5.6,35.97],[32.3,30.0],[43.4,12.6],[72.8,18.9],[100.3,2.5],[121.5,31.2],[139.7,35.4]] },
  { name: "JUPITER", note: "Japan ↔ US West Coast transpacific.",
    waypoints: [[140.0,35.3],[170.0,38.0],[-160.0,30.0],[-118.2,33.9]] },
  { name: "PLCN / Bifrost", note: "SE Asia ↔ US transpacific.",
    waypoints: [[103.85,1.28],[125.0,10.0],[145.0,15.0],[-175.0,20.0],[-122.0,37.5]] },
  { name: "EllaLink", note: "Brazil ↔ Portugal south-Atlantic.",
    waypoints: [[-38.5,-3.7],[-25.0,10.0],[-15.0,30.0],[-9.14,38.7]] },
  { name: "Equiano", note: "Portugal ↔ South Africa along W. Africa (Google).",
    waypoints: [[-9.14,38.7],[-16.0,14.7],[3.4,6.4],[13.2,-8.8],[18.4,-33.9]] },
  { name: "TAT-14 (legacy)", note: "US ↔ UK/France/Germany north-Atlantic.",
    waypoints: [[-74.0,39.4],[-40.0,45.0],[-8.0,50.4],[-1.0,50.3],[4.3,52.0]] },
  { name: "AAE-1", note: "SE Asia ↔ Europe via S.Asia, Gulf & Egypt.",
    waypoints: [[103.85,1.28],[97.5,5.5],[80.0,6.0],[67.0,24.8],[56.5,26.6],[43.4,12.6],[32.35,30.5],[29.9,31.2],[5.36,43.3]] },
  { name: "Asia-America Gateway", note: "SE Asia ↔ US via Guam/Hawaii.",
    waypoints: [[103.85,1.28],[114.1,22.3],[121.5,15.0],[144.8,13.5],[-157.9,21.3],[-118.2,33.7]] },
  { name: "SAIL", note: "Brazil ↔ Cameroon south-Atlantic.",
    waypoints: [[-38.5,-3.7],[-15.0,-2.0],[9.7,4.05]] },
  { name: "Japan-Guam-Australia", note: "Japan ↔ Guam ↔ Sydney (JGA).",
    waypoints: [[139.7,35.3],[144.8,13.5],[151.2,-33.9]] },
  { name: "Hawaiki", note: "Australia/NZ ↔ US Pacific.",
    waypoints: [[151.2,-33.9],[174.8,-41.0],[-157.9,21.3],[-122.0,45.5]] },
  { name: "India-Europe (IMEWE)", note: "India ↔ Mediterranean ↔ Europe.",
    waypoints: [[72.85,18.9],[60.0,24.0],[43.4,12.6],[32.35,30.5],[14.5,37.5],[8.9,44.4]] },
  { name: "BRICS/others (trans-Pacific FASTER)", note: "Japan ↔ US West Coast.",
    waypoints: [[133.0,33.5],[160.0,40.0],[-150.0,42.0],[-124.0,41.7]] },
  { name: "Dunant", note: "France ↔ US transatlantic (Google), 250 Tbps.",
    waypoints: [[-1.0,45.6],[-30.0,44.0],[-60.0,40.0],[-75.9,36.9]] },
  { name: "Amitié", note: "US ↔ France/UK transatlantic (Meta).",
    waypoints: [[-70.9,42.6],[-40.0,46.0],[-8.0,48.0],[-1.0,45.6]] },
  { name: "SEA-ME-WE 5", note: "Singapore ↔ France via S.Asia, Gulf & Egypt.",
    waypoints: [[103.85,1.28],[90.4,22.0],[73.0,15.0],[43.4,12.6],[32.35,30.5],[5.36,43.3]] },
  { name: "PEACE Cable", note: "China ↔ Pakistan ↔ E.Africa ↔ Europe.",
    waypoints: [[67.0,24.8],[43.4,12.6],[32.35,30.5],[14.5,37.5],[-9.14,38.7]] },
  { name: "Africa-1", note: "E.Africa ↔ ME ↔ Europe east-coast ring.",
    waypoints: [[39.7,-4.05],[43.15,11.6],[32.3,29.9],[35.5,33.9],[12.5,42.0]] },
  { name: "Southern Cross NEXT", note: "Australia ↔ US via Pacific islands.",
    waypoints: [[151.2,-33.9],[179.0,-18.0],[-160.0,-10.0],[-118.2,33.9]] },
  { name: "Curie", note: "US ↔ Chile Pacific (Google).",
    waypoints: [[-118.2,33.9],[-105.0,5.0],[-85.0,-12.0],[-71.6,-33.0]] },
  { name: "Havfrue / AEC-2", note: "US ↔ Ireland/Denmark north-Atlantic.",
    waypoints: [[-73.9,40.4],[-40.0,50.0],[-9.5,53.3],[8.0,56.0]] },
  { name: "BRUSA", note: "Brazil ↔ US (Fortaleza ↔ Virginia Beach).",
    waypoints: [[-38.5,-3.7],[-52.0,10.0],[-66.0,22.0],[-75.98,36.85]] },
  { name: "INDIGO", note: "Singapore ↔ Perth ↔ Sydney.",
    waypoints: [[103.85,1.28],[110.0,-8.0],[115.85,-31.95],[135.0,-34.0],[151.2,-33.9]] },
  { name: "2Africa", note: "World's longest cable — rings the whole African continent + Europe/ME.",
    waypoints: [[-0.1,51.5],[-9.1,38.7],[-17.4,14.7],[8.7,3.9],[13.2,-8.8],[18.4,-33.9],[39.0,-6.8],[43.2,11.6],[32.5,29.9],[35.0,32.1]] },
  { name: "Grace Hopper", note: "New York ↔ UK ↔ Spain; Google transatlantic.",
    waypoints: [[-74.0,40.5],[-40.0,45.0],[-8.6,41.1],[-5.3,50.1]] },
  { name: "EllaLink", note: "Brazil (Fortaleza) ↔ Portugal (Sines); direct S.America–Europe.",
    waypoints: [[-38.5,-3.7],[-25.0,12.0],[-15.0,30.0],[-8.9,37.9]] },
  { name: "Equiano", note: "Portugal ↔ Nigeria ↔ South Africa; Google west-Africa cable.",
    waypoints: [[-9.1,38.7],[-17.4,14.7],[3.4,6.4],[8.7,-3.0],[18.4,-33.9]] },
  { name: "SeaMeWe-6", note: "SE Asia ↔ Middle East ↔ W. Europe trunk.",
    waypoints: [[103.85,1.28],[80.2,6.9],[55.3,25.0],[43.2,12.5],[32.3,29.9],[14.5,35.9],[3.0,43.3]] },
  { name: "Bifrost", note: "Singapore ↔ Indonesia ↔ US West Coast; first direct trans-Pacific via Java Sea.",
    waypoints: [[103.85,1.28],[118.0,5.0],[135.0,8.0],[-160.0,25.0],[-118.2,34.0]] },
  { name: "Echo", note: "US ↔ Guam ↔ Singapore/Indonesia; Google/Meta trans-Pacific.",
    waypoints: [[-122.0,37.4],[-145.0,20.0],[144.8,13.5],[125.0,5.0],[103.85,1.28]] },
  { name: "JUPITER", note: "Japan ↔ Philippines ↔ US West Coast.",
    waypoints: [[139.9,35.0],[141.0,38.0],[-160.0,35.0],[-121.9,36.6]] },
  { name: "Hawaiki", note: "US ↔ Hawaii ↔ New Zealand ↔ Australia.",
    waypoints: [[-122.0,37.4],[-157.9,21.3],[-170.0,-10.0],[174.8,-37.0],[151.2,-33.9]] },
  { name: "Dunant", note: "Virginia Beach ↔ France (Google) transatlantic.",
    waypoints: [[-75.98,36.85],[-40.0,42.0],[-10.0,45.5],[-1.2,46.2]] },
  { name: "EllaLink", note: "Brazil ↔ Portugal — direct South-Atlantic link.",
    waypoints: [[-38.5,-12.97],[-25.0,0.0],[-9.4,38.7]] },
  { name: "Equiano", note: "Portugal ↔ West Africa ↔ South Africa (Google).",
    waypoints: [[-9.1,38.7],[-16.0,28.0],[-17.4,14.7],[8.7,4.4],[13.2,-8.8],[18.4,-33.9]] },
  { name: "Curie", note: "Los Angeles ↔ Panama ↔ Chile (Google), Americas west coast.",
    waypoints: [[-118.5,33.7],[-105.0,20.0],[-84.0,9.5],[-79.0,-3.0],[-71.6,-33.05]] },
  { name: "PEACE", note: "Pakistan ↔ Egypt ↔ France; China-backed Eurasia route.",
    waypoints: [[67.0,24.9],[60.0,22.0],[43.4,12.6],[32.35,30.5],[5.36,43.3],[-4.0,48.4]] },
  { name: "Bifrost", note: "Singapore ↔ Indonesia ↔ US West Coast, transpacific.",
    waypoints: [[103.85,1.28],[110.0,-3.0],[130.0,3.0],[160.0,15.0],[-160.0,30.0],[-118.5,33.7]] },
  { name: "Apricot", note: "Japan ↔ Guam ↔ Philippines ↔ Singapore intra-Asia trunk.",
    waypoints: [[139.9,35.0],[144.8,13.5],[121.0,14.6],[110.0,3.0],[103.85,1.28]] },
  { name: "Amitié", note: "US ↔ France/UK high-capacity transatlantic (Meta).",
    waypoints: [[-70.9,42.6],[-45.0,45.0],[-15.0,47.0],[-4.5,48.4]] },
  { name: "SEA-ME-WE 3", note: "Longest legacy cable — W.Europe ↔ Asia ↔ Australia, 39 landings.",
    waypoints: [[8.9,44.4],[5.36,43.3],[32.35,30.5],[43.4,12.6],[72.8,18.9],[100.3,2.5],[114.1,22.3],[139.7,35.4]] },
  { name: "WACS", note: "West Africa Cable System — UK ↔ W.Africa ↔ South Africa.",
    waypoints: [[-3.5,50.1],[-9.14,38.7],[-16.0,14.7],[3.4,6.4],[13.2,-8.8],[18.4,-33.9]] },
  { name: "ACE", note: "Africa Coast to Europe — France ↔ 20+ West-African landings.",
    waypoints: [[-1.0,48.5],[-9.14,38.7],[-16.0,14.7],[-13.7,9.5],[3.4,6.4],[9.4,-0.7]] },
  { name: "SAT-3/WASC", note: "Legacy Portugal ↔ West Africa ↔ South Africa trunk.",
    waypoints: [[-9.14,38.7],[-16.0,14.7],[3.4,6.4],[9.4,-0.7],[13.2,-8.8],[18.4,-33.9]] },
  { name: "Blue-Raman", note: "India ↔ Italy ↔ Israel; Saudi land-bridge bypassing Egypt.",
    waypoints: [[72.85,18.9],[58.0,23.0],[43.4,13.0],[35.0,29.5],[34.9,32.0],[14.5,37.5],[12.5,41.9]] },
  { name: "Asia Direct Cable (ADC)", note: "SE Asia ↔ China ↔ Japan intra-Asia trunk.",
    waypoints: [[103.85,1.28],[108.2,16.0],[114.1,22.3],[121.0,14.5],[140.0,35.3]] },
  { name: "Firmina", note: "US ↔ Argentina; one of Google's longest single-run cables.",
    waypoints: [[-81.0,32.0],[-70.0,18.0],[-55.0,-8.0],[-48.0,-25.0],[-58.4,-34.6]] },
  { name: "Humboldt (planned)", note: "Chile ↔ Australia/NZ; first direct South-Pacific link.",
    waypoints: [[-70.9,-33.0],[-110.0,-30.0],[-150.0,-25.0],[174.8,-41.0],[151.2,-33.9]] },
];

// ── Subsea-cable / pipeline sabotage & cut incidents ───────────────────
// Curated register of notable damage to undersea cables and pipelines. Rides
// with the merged "infra" layer as ⊗ markers. coords are [lon,lat]. status:
// SEVERED | DAMAGED | SUSPECTED | REPAIRED. type: CABLE | GAS | OIL | POWER.
const INFRA_INCIDENTS = [
  { name: "Nord Stream 1 & 2", coords: [15.55, 55.53], date: "2022-09-26", type: "GAS", status: "DAMAGED",
    note: "Baltic seabed NE of Bornholm — four ruptures from underwater explosions; both strings offline." },
  { name: "Petroline (East–West) pump stations 8 & 9", coords: [44.4, 24.5], date: "2019-05-14", type: "OIL", status: "REPAIRED",
    note: "Saudi East–West crude pipeline hit by Houthi drones near Ad-Dawadmi; pumping briefly halted. Recent strikes near any pipeline auto-flag as LIVE." },
  { name: "Abqaiq–Khurais processing", coords: [49.68, 25.94], date: "2019-09-14", type: "OIL", status: "REPAIRED",
    note: "Drone/cruise-missile attack on the world's largest crude-processing complex; ~5% of global supply briefly offline." },
  { name: "Balticconnector", coords: [26.0, 59.75], date: "2023-10-08", type: "GAS", status: "REPAIRED",
    note: "Finland–Estonia gas pipeline + telecom cable dragged/broken by a ship's anchor (Newnew Polar Bear). Reopened Apr 2024." },
  { name: "C-Lion1 / BCS East-West", coords: [18.1, 55.9], date: "2024-11-17", type: "CABLE", status: "SEVERED",
    note: "Two Baltic data cables (Finland–Germany, Sweden–Lithuania) cut near Gotland; vessel Yi Peng 3 investigated." },
  { name: "EstLink 2", coords: [26.6, 59.95], date: "2024-12-25", type: "POWER", status: "DAMAGED",
    note: "Finland–Estonia HVDC power cable + 4 telecom cables damaged in the Gulf of Finland; tanker Eagle S anchor seized." },
  { name: "Red Sea cables (EIG/AAE-1/Seacom/TGN)", coords: [43.3, 13.6], date: "2024-02-24", type: "CABLE", status: "SEVERED",
    note: "Multiple Europe–Asia cables cut near Bab-el-Mandeb — anchor of the Houthi-struck cargo ship Rubymar suspected." },
  { name: "Matsu Islands cables", coords: [119.95, 26.16], date: "2023-02-08", type: "CABLE", status: "SEVERED",
    note: "Both cables serving Taiwan's Matsu islands cut within days by Chinese vessels; ~14k residents lost service." },
  { name: "Taiwan NW cable (Trans-Pacific)", coords: [121.9, 25.3], date: "2025-01-03", type: "CABLE", status: "SUSPECTED",
    note: "Cable off Keelung damaged; Cameroon-flagged Shunxing-39 (China-linked ownership) suspected of anchor drag." },
  { name: "Taiwan–Penghu No.3", coords: [119.7, 23.6], date: "2025-02-25", type: "CABLE", status: "SEVERED",
    note: "Undersea cable to the Penghu islands cut; Togo-flagged, China-crewed Hongtai detained by Taiwan." },
];

// ── GPS jamming / spoofing zones (documented persistent areas) ─────────
const GPS_JAM_ZONES = [
  { name: "Eastern Mediterranean", coords: [34.0, 34.0], radiusKm: 350, level: "SEVERE", note: "Cyprus–Syria–Lebanon spoofing hotspot." },
  { name: "Black Sea", coords: [34.0, 44.0], radiusKm: 450, level: "SEVERE", note: "Persistent jamming around the conflict zone." },
  { name: "Kaliningrad / Baltic", coords: [20.5, 55.0], radiusKm: 380, level: "HIGH", note: "Disrupts Baltic aviation & shipping." },
  { name: "Strait of Hormuz / Gulf", coords: [55.5, 26.5], radiusKm: 320, level: "HIGH", note: "Tanker GPS spoofing incidents." },
  { name: "Northern Israel", coords: [35.3, 32.9], radiusKm: 160, level: "SEVERE", note: "Heavy spoofing since 2023." },
  { name: "Korean Peninsula (DMZ)", coords: [126.9, 37.9], radiusKm: 200, level: "HIGH", note: "North Korean jamming of the South." },
  { name: "Finnmark / Kola border", coords: [26.0, 69.5], radiusKm: 300, level: "HIGH", note: "Arctic GNSS interference near Russia." },
  { name: "Libya", coords: [17.0, 30.5], radiusKm: 300, level: "MODERATE", note: "Intermittent conflict-linked jamming." },
  { name: "Myanmar", coords: [96.5, 21.0], radiusKm: 260, level: "MODERATE", note: "Civil-war-linked GNSS disruption." },
];

// ── Conflict zones (shaded areas) ──────────────────────────────────────
// intensity: ACTIVE (open warfare) | ELEVATED (armed conflict / high tension) | WATCH
// polygon: an [lon,lat] ring outlining the affected area (auto-closed & wound in code).
const CONFLICT_ZONES = [
  { name: "Eastern & Southern Ukraine", intensity: "ACTIVE",
    note: "Active front line — Russia–Ukraine war; artillery, drones, shifting contact line.",
    polygon: [[36.6,50.0],[38.6,49.9],[39.0,47.7],[36.6,46.3],[32.4,46.2],[33.4,48.2],[35.0,49.6]] },
  { name: "Gaza & Envelope", intensity: "ACTIVE",
    note: "Israel–Gaza war zone; sustained operations and displacement.",
    polygon: [[34.2,31.62],[34.58,31.6],[34.62,31.22],[34.2,31.22]] },
  { name: "South Lebanon Border", intensity: "ELEVATED",
    note: "Israel–Hezbollah exchange zone along the Blue Line.",
    polygon: [[35.1,33.42],[35.62,33.4],[35.62,33.05],[35.1,33.05]] },
  { name: "Syria", intensity: "ELEVATED",
    note: "Fragmented control; residual insurgency, airstrikes and cross-border strikes.",
    polygon: [[35.7,37.3],[42.1,37.1],[41.0,32.6],[35.8,32.7],[35.7,35.2]] },
  { name: "Yemen", intensity: "ACTIVE",
    note: "Houthi–government war plus Red Sea maritime attacks.",
    polygon: [[42.6,17.6],[47.2,16.2],[52.5,15.6],[53.1,13.0],[44.0,12.6],[42.8,15.0]] },
  { name: "Red Sea / Bab-el-Mandeb", intensity: "ELEVATED",
    note: "Houthi anti-shipping strikes; war-risk premiums and diversions.",
    polygon: [[41.2,15.6],[43.4,12.2],[45.2,12.6],[43.6,16.6],[41.6,17.0]] },
  { name: "Sudan", intensity: "ACTIVE",
    note: "SAF–RSF civil war; mass displacement and famine risk.",
    polygon: [[22.0,16.2],[34.2,16.0],[35.2,11.4],[27.0,10.0],[22.0,12.2]] },
  { name: "Sahel Tri-Border", intensity: "ACTIVE",
    note: "Mali–Burkina Faso–Niger jihadist insurgency belt.",
    polygon: [[-4.2,16.2],[3.2,15.6],[2.6,11.8],[-6.2,13.0]] },
  { name: "Eastern DR Congo", intensity: "ACTIVE",
    note: "M23 and armed-group conflict across the Kivus.",
    polygon: [[27.4,1.2],[29.7,1.2],[29.9,-3.6],[27.0,-3.1]] },
  { name: "Somalia", intensity: "ELEVATED",
    note: "Al-Shabaab insurgency; recurrent offensives and attacks.",
    polygon: [[41.0,3.6],[45.2,4.2],[49.2,3.0],[45.6,-1.6],[41.0,-1.0],[40.0,1.6]] },
  { name: "Myanmar Civil War", intensity: "ACTIVE",
    note: "Post-coup nationwide conflict; military vs resistance & EAOs.",
    polygon: [[92.6,24.2],[98.2,24.2],[99.6,20.0],[97.0,16.4],[94.0,17.0],[92.6,21.0]] },
  { name: "Afghanistan–Pakistan Border Belt", intensity: "ELEVATED",
    note: "TTP/ISKP militancy and cross-border strikes along the Durand Line.",
    polygon: [[66.4,29.9],[70.0,35.8],[71.8,37.0],[73.6,36.6],[71.2,33.4],[68.0,30.6]] },
  { name: "Kashmir (Line of Control)", intensity: "WATCH",
    note: "Militarised India–Pakistan frontier; periodic exchanges of fire.",
    polygon: [[73.8,34.65],[75.1,34.8],[74.9,32.9],[74.0,33.1]] },
  { name: "Sahel / Lake Chad Basin", intensity: "ELEVATED",
    note: "Boko Haram / ISWAP insurgency around Lake Chad.",
    polygon: [[12.6,14.4],[15.2,13.6],[14.6,11.0],[12.2,11.2],[11.6,12.8]] },
];

// ── Displacement / migration flows (origin → destination corridors) ────
// scale: rough magnitude (drives line weight). Illustrative current flows.
const DISPLACEMENT_FLOWS = [
  { name: "Ukraine → Poland", from: [30.5, 50.45], to: [21.0, 52.23], scale: 5, note: "Largest European displacement since WWII." },
  { name: "Ukraine → Germany", from: [30.5, 50.45], to: [13.4, 52.52], scale: 4, note: "Major onward refugee destination." },
  { name: "Syria → Türkiye", from: [38.0, 35.5], to: [32.0, 39.0], scale: 5, note: "~3M Syrian refugees hosted." },
  { name: "Syria → Lebanon", from: [37.0, 34.5], to: [35.9, 33.9], scale: 3, note: "Highest refugee-per-capita globally." },
  { name: "Syria → Jordan", from: [36.5, 33.0], to: [36.0, 31.95], scale: 2, note: "Zaatari & Azraq camps." },
  { name: "Sudan → Chad", from: [24.0, 13.5], to: [20.9, 12.1], scale: 4, note: "Darfur flight into eastern Chad." },
  { name: "Sudan → Egypt", from: [32.5, 15.6], to: [31.2, 30.0], scale: 3, note: "Northbound flight from the civil war." },
  { name: "Sudan → South Sudan", from: [32.5, 13.0], to: [31.6, 6.9], scale: 3, note: "Returnees & refugees southward." },
  { name: "Afghanistan → Pakistan", from: [69.2, 34.5], to: [71.5, 33.9], scale: 4, note: "Decades of refugee movement; recent expulsions." },
  { name: "Afghanistan → Iran", from: [66.0, 33.0], to: [59.6, 34.0], scale: 4, note: "Millions of Afghans in Iran." },
  { name: "Venezuela → Colombia", from: [-66.9, 10.5], to: [-74.1, 4.7], scale: 5, note: "~7M Venezuelans displaced regionally." },
  { name: "Venezuela → Peru", from: [-66.9, 8.5], to: [-77.0, -12.0], scale: 3, note: "Southbound migration corridor." },
  { name: "Myanmar → Bangladesh", from: [92.9, 20.8], to: [92.2, 21.2], scale: 4, note: "Rohingya at Cox's Bazar — world's largest camp." },
  { name: "South Sudan → Uganda", from: [31.6, 5.5], to: [32.3, 2.5], scale: 3, note: "Bidi Bidi mega-settlement." },
  { name: "DR Congo → Uganda", from: [29.2, 0.0], to: [30.5, 0.5], scale: 3, note: "Eastern DRC conflict displacement." },
  { name: "Somalia → Kenya", from: [43.0, 2.0], to: [40.3, 0.0], scale: 2, note: "Dadaab refugee complex." },
  { name: "Central America → US", from: [-90.5, 14.6], to: [-99.0, 19.4], scale: 4, note: "Honduras/Guatemala → Mexico → US corridor." },
  { name: "Mexico → United States", from: [-100.0, 22.0], to: [-106.5, 31.8], scale: 4, note: "Primary northbound migration route." },
  { name: "N. Africa → Italy", from: [13.2, 32.9], to: [12.6, 37.6], scale: 3, note: "Central Mediterranean sea crossing." },
  { name: "West Africa → Canary Is.", from: [-17.4, 14.7], to: [-15.6, 28.1], scale: 2, note: "Atlantic route to Spain." },
  { name: "Ethiopia (Tigray) IDP", from: [39.5, 14.0], to: [38.7, 9.0], scale: 2, note: "Internal displacement after the Tigray war." },
];

// ── Major global commodity trade flows (drawn like displacement: animated arcs) ──
// Same shape as DISPLACEMENT_FLOWS ({ name, from:[lon,lat], to:[lon,lat], scale, note }).
const COMMODITY_FLOWS = [
  { name: "Gulf → East Asia", kind: "CRUDE OIL", from: [52.0, 26.5], to: [121.5, 31.2], scale: 5, note: "Persian Gulf crude via Hormuz & Malacca to China/Japan/Korea." },
  { name: "Gulf → India", kind: "CRUDE OIL", from: [50.5, 26.0], to: [72.8, 19.0], scale: 4, note: "Saudi/Iraqi/UAE crude to Indian refineries." },
  { name: "Russia → China", kind: "OIL & GAS", from: [104.3, 52.3], to: [116.4, 39.9], scale: 4, note: "ESPO pipeline & Power of Siberia — eastward pivot since 2022." },
  { name: "Russia → Europe", kind: "PIPELINE GAS", from: [50.0, 61.0], to: [13.4, 52.5], scale: 2, note: "Sharply reduced post-2022; residual TurkStream volumes." },
  { name: "US Gulf → Europe", kind: "LNG", from: [-93.5, 29.3], to: [-1.0, 51.0], scale: 4, note: "US LNG backfilling lost Russian pipeline gas." },
  { name: "Qatar → East Asia", kind: "LNG", from: [51.5, 25.3], to: [130.0, 33.0], scale: 4, note: "North Field LNG to Japan/Korea/China." },
  { name: "Australia → China", kind: "IRON ORE", from: [117.2, -20.3], to: [121.5, 31.2], scale: 5, note: "Pilbara iron ore — the world's largest dry-bulk flow." },
  { name: "Australia → East Asia", kind: "LNG & COAL", from: [146.0, -19.3], to: [130.0, 33.0], scale: 4, note: "Gladstone/NW Shelf LNG & thermal coal to Japan/Korea." },
  { name: "Brazil → China", kind: "SOY & ORE", from: [-43.2, -22.9], to: [121.5, 31.2], scale: 5, note: "Soybeans, iron ore & crude across the South Atlantic & Cape." },
  { name: "Chile/Peru → China", kind: "COPPER", from: [-70.6, -30.0], to: [121.5, 31.2], scale: 3, note: "Andean copper concentrate to Chinese smelters." },
  { name: "Black Sea → MENA", kind: "GRAIN", from: [31.5, 46.5], to: [31.2, 30.0], scale: 4, note: "Ukrainian/Russian wheat & corn to Egypt & the Middle East." },
  { name: "US Midwest → World", kind: "GRAIN", from: [-90.2, 38.6], to: [-5.0, 36.0], scale: 3, note: "Mississippi–Gulf corn & soybean exports." },
  { name: "West Africa → Europe", kind: "CRUDE OIL", from: [6.0, 4.5], to: [-1.5, 50.0], scale: 3, note: "Nigerian/Angolan light sweet crude northbound." },
  { name: "Canada → United States", kind: "CRUDE OIL", from: [-113.5, 53.5], to: [-95.4, 39.1], scale: 4, note: "Alberta oil-sands crude via Keystone to US refineries." },
  { name: "Norway → Europe", kind: "PIPELINE GAS", from: [5.3, 60.5], to: [8.0, 51.5], scale: 4, note: "Now Europe's top pipeline-gas supplier via the North Sea." },
  { name: "Algeria → Europe", kind: "PIPELINE GAS", from: [3.0, 34.0], to: [9.0, 41.9], scale: 3, note: "Transmed & Medgaz pipelines to Italy & Spain." },
  { name: "Turkmenistan → China", kind: "PIPELINE GAS", from: [59.0, 39.0], to: [87.0, 43.8], scale: 4, note: "Central Asia–China pipeline — China's largest gas import route." },
  { name: "Kazakhstan → China", kind: "CRUDE OIL", from: [51.2, 47.1], to: [87.0, 43.8], scale: 3, note: "Kazakh crude via the Atyrau–Alashankou pipeline." },
  { name: "Nigeria → India", kind: "CRUDE OIL", from: [5.5, 4.5], to: [72.8, 19.0], scale: 3, note: "West African light sweet crude to Indian refiners." },
  { name: "Angola → China", kind: "CRUDE OIL", from: [12.2, -8.8], to: [113.3, 23.1], scale: 3, note: "Angolan crude — a top supplier to China." },
  { name: "Iraq → Asia & Europe", kind: "CRUDE OIL", from: [47.8, 30.5], to: [90.0, 20.0], scale: 4, note: "Basra crude via Hormuz to Asian and European buyers." },
  { name: "Libya → Europe", kind: "CRUDE OIL", from: [18.0, 30.2], to: [12.5, 41.9], scale: 2, note: "Light sweet crude across the central Mediterranean." },
  { name: "Indonesia → East Asia", kind: "THERMAL COAL", from: [113.9, -2.5], to: [121.5, 31.2], scale: 4, note: "The world's largest thermal-coal exporter, to China & India." },
  { name: "Mongolia → China", kind: "COKING COAL", from: [106.9, 43.0], to: [111.7, 40.8], scale: 3, note: "Coking coal overland to Chinese steel mills." },
  { name: "South Africa → Asia", kind: "COAL & PGM", from: [29.5, -26.0], to: [110.0, 20.0], scale: 3, note: "Coal & platinum-group metals via Richards Bay." },
  { name: "DR Congo → China", kind: "COBALT & CU", from: [27.5, -11.0], to: [113.3, 23.1], scale: 3, note: "~70% of world cobalt, refined mainly in China." },
  { name: "Guinea → China", kind: "BAUXITE", from: [-13.7, 10.9], to: [113.3, 23.1], scale: 3, note: "Bauxite feeding Chinese aluminium smelters." },
  { name: "Argentina → World", kind: "SOY & GRAIN", from: [-60.7, -33.0], to: [10.0, 45.0], scale: 3, note: "Soybean meal & grain from the Rosario–Paraná hub." },
  { name: "Ukraine → Europe", kind: "GRAIN", from: [30.5, 49.5], to: [21.0, 48.0], scale: 3, note: "Overland 'solidarity lanes' when the Black Sea is contested." },
  { name: "India → Europe", kind: "REFINED FUEL", from: [70.0, 22.0], to: [-1.0, 50.0], scale: 3, note: "Jamnagar diesel & jet-fuel exports westward." },
];

// ── Religion composition by country (approx %, majority→minority) ──────
// Keyed by Natural Earth 110m/50m country names. Values: [name, percent].
const RELIGION_DATA = {
  "United States of America": [["Christian", 63], ["Unaffiliated", 29], ["Jewish", 2], ["Muslim", 1], ["Other", 5]],
  "Canada": [["Christian", 53], ["Unaffiliated", 35], ["Muslim", 5], ["Hindu", 2], ["Other", 5]],
  "Mexico": [["Catholic", 78], ["Protestant", 11], ["Unaffiliated", 8], ["Other", 3]],
  "Brazil": [["Catholic", 50], ["Protestant", 31], ["Unaffiliated", 11], ["Spiritist", 3], ["Other", 5]],
  "Argentina": [["Catholic", 62], ["Unaffiliated", 26], ["Protestant", 9], ["Other", 3]],
  "Colombia": [["Catholic", 73], ["Protestant", 14], ["Unaffiliated", 11], ["Other", 2]],
  "United Kingdom": [["Christian", 46], ["Unaffiliated", 37], ["Muslim", 6], ["Hindu", 2], ["Other", 9]],
  "France": [["Christian", 47], ["Unaffiliated", 40], ["Muslim", 8], ["Jewish", 1], ["Other", 4]],
  "Germany": [["Christian", 52], ["Unaffiliated", 40], ["Muslim", 6], ["Other", 2]],
  "Spain": [["Catholic", 58], ["Unaffiliated", 37], ["Muslim", 3], ["Other", 2]],
  "Italy": [["Catholic", 71], ["Unaffiliated", 22], ["Muslim", 4], ["Other", 3]],
  "Netherlands": [["Unaffiliated", 54], ["Christian", 38], ["Muslim", 5], ["Other", 3]],
  "Poland": [["Catholic", 85], ["Unaffiliated", 12], ["Other", 3]],
  "Russia": [["Orthodox Christian", 63], ["Unaffiliated", 26], ["Muslim", 7], ["Other", 4]],
  "Ukraine": [["Orthodox Christian", 78], ["Greek Catholic", 10], ["Unaffiliated", 8], ["Other", 4]],
  "Greece": [["Orthodox Christian", 90], ["Unaffiliated", 6], ["Muslim", 2], ["Other", 2]],
  "Sweden": [["Christian", 57], ["Unaffiliated", 36], ["Muslim", 5], ["Other", 2]],
  "Norway": [["Christian", 66], ["Unaffiliated", 27], ["Muslim", 4], ["Other", 3]],
  "Turkey": [["Muslim (Sunni)", 78], ["Muslim (Alevi/Shia)", 15], ["Unaffiliated", 5], ["Other", 2]],
  "Serbia": [["Orthodox Christian", 81], ["Catholic", 5], ["Muslim", 3], ["Other", 11]],
  "Bosnia and Herz.": [["Muslim", 51], ["Orthodox Christian", 31], ["Catholic", 15], ["Other", 3]],
  "Albania": [["Muslim", 57], ["Christian", 17], ["Unaffiliated", 20], ["Other", 6]],

  "Iran": [["Muslim (Shia)", 90], ["Muslim (Sunni)", 8], ["Baha'i / Other", 1], ["Christian/Zoroastrian/Jewish", 1]],
  "Iraq": [["Muslim (Shia)", 61], ["Muslim (Sunni)", 34], ["Christian", 2], ["Yazidi / Other", 3]],
  "Israel": [["Jewish", 74], ["Muslim", 18], ["Christian", 2], ["Druze", 2], ["Other", 4]],
  "Palestine": [["Muslim (Sunni)", 93], ["Christian", 6], ["Other", 1]],
  "Syria": [["Muslim (Sunni)", 74], ["Alawite/Shia", 13], ["Christian", 8], ["Druze", 3], ["Other", 2]],
  "Lebanon": [["Muslim (Sunni)", 30], ["Muslim (Shia)", 30], ["Christian (Maronite/other)", 34], ["Druze", 5], ["Other", 1]],
  "Jordan": [["Muslim (Sunni)", 92], ["Christian", 6], ["Other", 2]],
  "Saudi Arabia": [["Muslim (Sunni)", 85], ["Muslim (Shia)", 12], ["Other", 3]],
  "Yemen": [["Muslim (Sunni)", 65], ["Muslim (Zaidi Shia)", 34], ["Other", 1]],
  "United Arab Emirates": [["Muslim", 76], ["Christian", 9], ["Hindu", 7], ["Buddhist", 3], ["Other", 5]],
  "Qatar": [["Muslim", 66], ["Christian", 14], ["Hindu", 14], ["Other", 6]],
  "Bahrain": [["Muslim (Shia majority)", 74], ["Christian", 9], ["Hindu", 10], ["Other", 7]],
  "Kuwait": [["Muslim", 75], ["Christian", 18], ["Hindu/Other", 7]],
  "Oman": [["Muslim (Ibadi)", 86], ["Christian", 6], ["Hindu", 5], ["Other", 3]],
  "Egypt": [["Muslim (Sunni)", 90], ["Christian (Coptic)", 10]],
  "Afghanistan": [["Muslim (Sunni)", 85], ["Muslim (Shia)", 14], ["Other", 1]],
  "Pakistan": [["Muslim (Sunni)", 80], ["Muslim (Shia)", 15], ["Hindu", 2], ["Christian", 2], ["Other", 1]],
  "India": [["Hindu", 80], ["Muslim", 14], ["Christian", 2], ["Sikh", 2], ["Buddhist/Other", 2]],
  "Bangladesh": [["Muslim", 91], ["Hindu", 8], ["Other", 1]],
  "Sri Lanka": [["Buddhist", 70], ["Hindu", 13], ["Muslim", 10], ["Christian", 7]],
  "Nepal": [["Hindu", 81], ["Buddhist", 9], ["Muslim", 5], ["Other", 5]],
  "China": [["Unaffiliated/Folk", 74], ["Buddhist", 18], ["Christian", 5], ["Muslim", 2], ["Other", 1]],
  "Japan": [["Shinto/Buddhist", 70], ["Unaffiliated", 27], ["Christian", 2], ["Other", 1]],
  "South Korea": [["Unaffiliated", 56], ["Christian", 28], ["Buddhist", 15], ["Other", 1]],
  "North Korea": [["Unaffiliated (state)", 71], ["Folk/Chondoist", 16], ["Buddhist", 9], ["Christian", 4]],
  "Vietnam": [["Folk/Unaffiliated", 74], ["Buddhist", 14], ["Christian", 8], ["Other", 4]],
  "Thailand": [["Buddhist", 93], ["Muslim", 5], ["Christian", 1], ["Other", 1]],
  "Myanmar": [["Buddhist", 88], ["Christian", 6], ["Muslim", 4], ["Other", 2]],
  "Indonesia": [["Muslim", 87], ["Christian", 10], ["Hindu", 2], ["Buddhist/Other", 1]],
  "Malaysia": [["Muslim", 64], ["Buddhist", 19], ["Christian", 9], ["Hindu", 6], ["Other", 2]],
  "Philippines": [["Catholic", 79], ["Other Christian", 11], ["Muslim", 6], ["Other", 4]],

  "Nigeria": [["Muslim", 53], ["Christian", 46], ["Other", 1]],
  "Ethiopia": [["Orthodox Christian", 43], ["Muslim", 34], ["Protestant", 19], ["Other", 4]],
  "Egypt ": [["Muslim (Sunni)", 90], ["Christian (Coptic)", 10]],
  "Sudan": [["Muslim (Sunni)", 91], ["Christian", 5], ["Traditional", 4]],
  "S. Sudan": [["Christian", 60], ["Traditional", 33], ["Muslim", 6], ["Other", 1]],
  "Dem. Rep. Congo": [["Christian", 93], ["Muslim", 2], ["Traditional/Other", 5]],
  "Somalia": [["Muslim (Sunni)", 99], ["Other", 1]],
  "Kenya": [["Christian", 85], ["Muslim", 11], ["Traditional/Other", 4]],
  "Tanzania": [["Christian", 63], ["Muslim", 34], ["Other", 3]],
  "South Africa": [["Christian", 78], ["Unaffiliated", 11], ["Traditional", 5], ["Muslim/Hindu", 3], ["Other", 3]],
  "Algeria": [["Muslim (Sunni)", 99], ["Christian/Other", 1]],
  "Morocco": [["Muslim (Sunni)", 99], ["Christian/Jewish", 1]],
  "Libya": [["Muslim (Sunni)", 97], ["Other", 3]],
  "Mali": [["Muslim", 94], ["Christian", 3], ["Traditional", 3]],
  "Chad": [["Muslim", 52], ["Christian", 44], ["Traditional/Other", 4]],
  "Australia": [["Christian", 44], ["Unaffiliated", 39], ["Muslim", 3], ["Hindu", 3], ["Other", 11]],
  "Indonesia ": [["Muslim", 87], ["Christian", 10], ["Other", 3]],
  "Kazakhstan": [["Muslim", 70], ["Orthodox Christian", 26], ["Other", 4]],
  "Uzbekistan": [["Muslim (Sunni)", 88], ["Orthodox Christian", 9], ["Other", 3]],
  "Azerbaijan": [["Muslim (Shia majority)", 96], ["Christian", 3], ["Other", 1]],
  "Armenia": [["Orthodox Christian (Apostolic)", 92], ["Other Christian", 5], ["Other", 3]],
  "Georgia": [["Orthodox Christian", 83], ["Muslim", 11], ["Armenian Church", 3], ["Other", 3]],
};

// ── Energy / trade exposure arteries — an event near one of these lines threatens
//    the flow named in `figure`. Geometry is [lon,lat]; `rKm` = how close (km) an
//    event must be to count as exposure (narrow pipes/cables ~55, broad lanes ~110).
//    Figures are curated, well-known approximations — headline scale, not live data.
const ENERGY_EXPOSURE = [
  // maritime chokepoints & lanes
  { name: "Strait of Hormuz", kind: "OIL", rKm: 130, figure: "≈20% of global seaborne oil (~20 Mb/d)",
    line: [[56.05,26.95],[56.55,26.55],[57.0,26.3]] },
  { name: "Strait of Malacca", kind: "TRADE", rKm: 120, figure: "≈30% of global trade; ~1/3 of seaborne crude to East Asia",
    line: [[100.35,3.05],[101.4,2.9],[103.8,1.28]] },
  { name: "Bab-el-Mandeb / Red Sea", kind: "TRADE", rKm: 130, figure: "≈12% of global trade; ~9% of seaborne oil",
    line: [[43.25,12.5],[43.4,12.7],[42.5,14.5],[41.2,16.3]] },
  { name: "Suez Canal", kind: "TRADE", rKm: 90, figure: "≈12–15% of global trade",
    line: [[32.31,29.93],[32.35,30.6],[32.55,31.26]] },
  { name: "Bosphorus", kind: "GRAIN", rKm: 90, figure: "Black Sea grain corridor & ~3% of world oil",
    line: [[28.98,40.98],[29.06,41.1],[29.12,41.2]] },
  { name: "Panama Canal", kind: "TRADE", rKm: 90, figure: "≈5% of global maritime trade",
    line: [[-79.92,9.34],[-79.68,9.08],[-79.52,8.9]] },
  // crude oil pipelines
  { name: "Druzhba (South)", kind: "OIL", rKm: 55, figure: "Russian crude to Hungary/Slovakia/Czechia",
    line: [[34.3,53.2],[30.0,51.5],[25.1,50.1],[22.3,48.6],[18.7,48.5],[17.1,48.15]] },
  { name: "CPC pipeline", kind: "OIL", rKm: 55, figure: "≈80% of Kazakh crude exports (~1.4 Mb/d)",
    line: [[53.4,46.2],[47.5,46.7],[43.5,45.7],[37.78,44.72]] },
  { name: "BTC pipeline", kind: "OIL", rKm: 55, figure: "Caspian crude bypassing Russia (~1 Mb/d)",
    line: [[49.9,40.4],[46.7,41.6],[44.8,41.7],[42.8,41.0],[41.3,39.9],[38.5,38.3],[35.8,36.9]] },
  { name: "ESPO pipeline", kind: "OIL", rKm: 55, figure: "Russia's Pacific crude artery to Asia (~1.6 Mb/d)",
    line: [[104.0,56.0],[113.5,56.0],[123.9,54.0],[130.5,48.5],[133.1,42.7]] },
  { name: "Petroline (East–West)", kind: "OIL", rKm: 55, figure: "Saudi Hormuz-bypass to the Red Sea (~5 Mb/d capacity)",
    line: [[49.7,26.0],[45.0,24.8],[41.5,24.3],[38.0,24.1]] },
  { name: "SUMED pipeline", kind: "OIL", rKm: 55, figure: "Suez crude-bypass line (~2.5 Mb/d)",
    line: [[32.33,29.6],[31.3,30.4],[29.7,31.1]] },
  // gas & LNG
  { name: "Nord Stream corridor", kind: "GAS", rKm: 60, figure: "Russia–Germany Baltic gas (offline since 2022)",
    line: [[13.6,54.2],[15.5,55.0],[20.0,55.6],[27.0,59.9]] },
  { name: "TurkStream", kind: "GAS", rKm: 60, figure: "Russian gas to Türkiye & SE Europe (~2% of EU supply)",
    line: [[37.8,44.7],[35.0,43.0],[31.0,41.9],[28.0,41.5]] },
  { name: "Southern Gas Corridor (TANAP/TAP)", kind: "GAS", rKm: 60, figure: "Caspian gas to Europe (~2% of EU supply)",
    line: [[49.9,40.4],[43.0,40.0],[36.0,39.9],[29.0,39.6],[24.0,40.6],[18.0,40.5]] },
  { name: "Power of Siberia", kind: "GAS", rKm: 60, figure: "Russia→China gas (up to ~38 bcm/yr)",
    line: [[120.0,56.0],[127.5,50.3],[127.5,45.0]] },
  { name: "Yamal–Europe", kind: "GAS", rKm: 60, figure: "Russia→Poland/Germany gas (largely curtailed)",
    line: [[66.0,66.0],[55.0,60.0],[40.0,55.0],[27.5,53.9],[23.9,52.1],[14.5,52.5]] },
  { name: "Ras Laffan LNG (Qatar)", kind: "LNG", rKm: 90, figure: "≈20% of global LNG",
    line: [[51.6,25.9]] },
  { name: "US Gulf LNG (Sabine/Freeport)", kind: "LNG", rKm: 110, figure: "Largest LNG export complex; backfills EU gas",
    line: [[-93.87,29.73]] },
  // subsea data cables
  { name: "Red Sea / Egypt cable corridor", kind: "DATA", rKm: 90, figure: "Europe–Asia data backbone (~17% of intercontinental traffic)",
    line: [[43.4,12.6],[38.0,20.0],[34.0,27.7],[32.35,30.0],[32.0,31.2]] },
  { name: "2Africa cable", kind: "DATA", rKm: 70, figure: "45,000 km subsea cable ringing Africa",
    line: [[-9.5,38.7],[-17.5,14.7],[8.7,4.4],[18.4,-33.9],[39.7,-4.05],[43.15,11.6],[32.3,29.9]] },
  { name: "Transatlantic cables", kind: "DATA", rKm: 70, figure: "High-capacity Europe–US data trunk",
    line: [[-75.98,36.85],[-45.0,40.0],[-15.0,43.0],[-2.9,43.4]] },
  // grain & bulk
  { name: "Ukraine grain corridor", kind: "GRAIN", rKm: 110, figure: "Black Sea grain exports (~10% of world wheat trade)",
    line: [[30.7,46.4],[31.4,45.4],[29.9,44.9]] },
  { name: "Pilbara→China iron ore", kind: "BULK", rKm: 110, figure: "World's largest dry-bulk flow",
    line: [[117.2,-20.3],[110.0,-8.0],[113.0,3.0],[114.0,22.0],[121.5,31.2]] },
];

// ── Naval / strait blockades & interdiction zones — drawn as hazard lines ──
// status: ACTIVE (enforced now) · DRILLS (rehearsal/encirclement) · THREATENED (declared/periodic)
const BLOCKADES = [
  { name: "Red Sea / Bab el-Mandeb", status: "ACTIVE",
    note: "Houthi anti-shipping campaign — missiles & drones on commercial vessels; most carriers diverting via the Cape of Good Hope.",
    waypoints: [[43.35, 12.6], [42.2, 14.3], [41.2, 16.3], [39.6, 19.0]] },
  { name: "Black Sea NW approaches", status: "ACTIVE",
    note: "Russian naval interdiction off Odesa and the Ukrainian coast; grain-corridor shipping under threat, sea mines reported.",
    waypoints: [[30.2, 46.1], [31.4, 45.4], [32.8, 44.7], [30.9, 45.6]] },
  { name: "Gaza maritime blockade", status: "ACTIVE",
    note: "Israeli naval blockade of the Gaza Strip; enforced exclusion zone along the coast.",
    waypoints: [[34.22, 31.6], [34.05, 31.48], [33.92, 31.33], [34.12, 31.22]] },
  { name: "Taiwan Strait", status: "DRILLS",
    note: "PLA blockade-rehearsal exercises encircling Taiwan; median-line crossings now routine.",
    waypoints: [[119.6, 25.4], [120.1, 24.4], [120.6, 23.4], [121.0, 22.4]] },
  { name: "Strait of Hormuz", status: "THREATENED",
    note: "Iran periodically threatens closure; IRGC tanker seizures. ~20% of seaborne oil transits here.",
    waypoints: [[55.9, 26.95], [56.5, 26.6], [57.0, 26.35]] },
  { name: "Kerch Strait / Sea of Azov", status: "ACTIVE",
    note: "Russian control of the Kerch Strait restricts access to Ukrainian Azov ports (Mariupol, Berdiansk).",
    waypoints: [[36.35, 45.45], [36.6, 45.2], [36.5, 44.95]] },
];

// ── MARKETS: what a place is tied to ──────────────────────────────────────────────────
// MARKET_LINKS: the instruments a place is linked to. Used by the event card's "markets this
//    touches" block and the second screen's tape (lib/app/touches.js), and by the investor page of
//    the situation report (modules/report.js). A name in `syms` is an instrument's `sym` in
//    MARKET_SEED (data.js); `y` gives its symbol for price history; `topics` link a subject named in a report or a
//    headline (a regular expression on its words). A link is a link by PLACE or SUBJECT,
//    never a claim that an event moved a price.
const MARKET_LINKS = {
  "kinds": {
    "OIL": {
      "why": "oil moves on this route",
      "syms": [
        "BRENT /bbl",
        "WTI /bbl",
        "ENERGY·XLE",
        "OIL VOL·OVX",
        "FRONTLINE·FRO"
      ]
    },
    "TRADE": {
      "why": "oil and cargo ships use this lane",
      "syms": [
        "BRENT /bbl",
        "WTI /bbl",
        "ZIM",
        "MAERSK·AMKBY"
      ]
    },
    "GAS": {
      "why": "gas moves on this route",
      "syms": [
        "NATGAS /MMBtu",
        "EU GAS /MWh"
      ]
    },
    "LNG": {
      "why": "liquefied gas ships from here",
      "syms": [
        "NATGAS /MMBtu",
        "EU GAS /MWh"
      ]
    },
    "GRAIN": {
      "why": "grain ships on this route",
      "syms": [
        "WHEAT /bu",
        "CORN /bu",
        "SOYBEANS /bu"
      ]
    }
  },
  "countries": {
    "Japan": [
      [
        "USD/JPY",
        "its currency"
      ],
      [
        "JAPAN·EWJ",
        "a fund of its shares"
      ]
    ],
    "China": [
      [
        "USD/CNY",
        "its currency"
      ],
      [
        "CHINA·MCHI",
        "a fund of its shares"
      ],
      [
        "RARE EARTHS·REMX",
        "where most rare earths are mined and refined"
      ]
    ],
    "Hong Kong": [
      [
        "HONGKONG·EWH",
        "a fund of its shares"
      ]
    ],
    "Taiwan": [
      [
        "SEMIS·SMH",
        "it makes most of the world's most advanced chips"
      ],
      [
        "TECH·XLK",
        "technology shares"
      ]
    ],
    "South Korea": [
      [
        "SEMIS·SMH",
        "a leading maker of memory chips"
      ]
    ],
    "India": [
      [
        "USD/INR",
        "its currency"
      ],
      [
        "INDIA·INDA",
        "a fund of its shares"
      ],
      [
        "RICE /cwt",
        "the largest rice exporter"
      ]
    ],
    "Brazil": [
      [
        "BRAZIL·EWZ",
        "a fund of its shares"
      ],
      [
        "SOYBEANS /bu",
        "the largest soybean exporter"
      ]
    ],
    "United Kingdom": [
      [
        "GBP/USD",
        "its currency"
      ],
      [
        "UK·EWU",
        "a fund of its shares"
      ]
    ],
    "Germany": [
      [
        "EUR/USD",
        "its currency"
      ],
      [
        "GERMANY·EWG",
        "a fund of its shares"
      ]
    ],
    "France": [
      [
        "EUR/USD",
        "its currency"
      ],
      [
        "EURO50·FEZ",
        "a fund of euro-area shares"
      ]
    ],
    "Italy": [
      [
        "EUR/USD",
        "its currency"
      ],
      [
        "EURO50·FEZ",
        "a fund of euro-area shares"
      ]
    ],
    "Spain": [
      [
        "EUR/USD",
        "its currency"
      ],
      [
        "EURO50·FEZ",
        "a fund of euro-area shares"
      ]
    ],
    "Belgium": [
      [
        "EUR/USD",
        "its currency"
      ],
      [
        "EURO50·FEZ",
        "a fund of euro-area shares"
      ]
    ],
    "Austria": [
      [
        "EUR/USD",
        "its currency"
      ],
      [
        "EURO50·FEZ",
        "a fund of euro-area shares"
      ]
    ],
    "Ireland": [
      [
        "EUR/USD",
        "its currency"
      ],
      [
        "EURO50·FEZ",
        "a fund of euro-area shares"
      ]
    ],
    "Portugal": [
      [
        "EUR/USD",
        "its currency"
      ],
      [
        "EURO50·FEZ",
        "a fund of euro-area shares"
      ]
    ],
    "Greece": [
      [
        "EUR/USD",
        "its currency"
      ],
      [
        "EURO50·FEZ",
        "a fund of euro-area shares"
      ]
    ],
    "Finland": [
      [
        "EUR/USD",
        "its currency"
      ],
      [
        "EURO50·FEZ",
        "a fund of euro-area shares"
      ]
    ],
    "Netherlands": [
      [
        "EUR/USD",
        "its currency"
      ],
      [
        "EURO50·FEZ",
        "a fund of euro-area shares"
      ],
      [
        "SEMIS·SMH",
        "home of the leading maker of chip-making machines"
      ]
    ],
    "Turkey": [
      [
        "USD/TRY",
        "its currency"
      ]
    ],
    "Canada": [
      [
        "USD/CAD",
        "its currency"
      ],
      [
        "WTI /bbl",
        "a leading oil exporter"
      ]
    ],
    "Australia": [
      [
        "AUD/USD",
        "its currency"
      ],
      [
        "LITHIUM·LIT",
        "the largest lithium miner"
      ]
    ],
    "Switzerland": [
      [
        "USD/CHF",
        "its currency"
      ]
    ],
    "United States of America": [
      [
        "S&P500·SPY",
        "a fund of its shares"
      ],
      [
        "DXY",
        "the dollar index"
      ]
    ],
    "Russia": [
      [
        "BRENT /bbl",
        "a leading oil exporter"
      ],
      [
        "NATGAS /MMBtu",
        "a leading gas exporter"
      ],
      [
        "WHEAT /bu",
        "the largest wheat exporter"
      ]
    ],
    "Ukraine": [
      [
        "WHEAT /bu",
        "a leading grain exporter"
      ],
      [
        "CORN /bu",
        "a leading corn exporter"
      ]
    ],
    "Saudi Arabia": [
      [
        "BRENT /bbl",
        "a leading oil exporter"
      ],
      [
        "WTI /bbl",
        "a leading oil exporter"
      ]
    ],
    "Iraq": [
      [
        "BRENT /bbl",
        "an oil exporter"
      ],
      [
        "WTI /bbl",
        "an oil exporter"
      ]
    ],
    "United Arab Emirates": [
      [
        "BRENT /bbl",
        "an oil exporter"
      ],
      [
        "WTI /bbl",
        "an oil exporter"
      ]
    ],
    "Kuwait": [
      [
        "BRENT /bbl",
        "an oil exporter"
      ],
      [
        "WTI /bbl",
        "an oil exporter"
      ]
    ],
    "Iran": [
      [
        "BRENT /bbl",
        "an oil exporter"
      ],
      [
        "WTI /bbl",
        "an oil exporter"
      ]
    ],
    "Libya": [
      [
        "BRENT /bbl",
        "an oil exporter"
      ],
      [
        "WTI /bbl",
        "an oil exporter"
      ]
    ],
    "Nigeria": [
      [
        "BRENT /bbl",
        "an oil exporter"
      ],
      [
        "WTI /bbl",
        "an oil exporter"
      ]
    ],
    "Venezuela": [
      [
        "BRENT /bbl",
        "an oil exporter"
      ],
      [
        "WTI /bbl",
        "an oil exporter"
      ]
    ],
    "Kazakhstan": [
      [
        "BRENT /bbl",
        "an oil exporter"
      ],
      [
        "WTI /bbl",
        "an oil exporter"
      ],
      [
        "URANIUM·URA",
        "the largest uranium producer"
      ]
    ],
    "Angola": [
      [
        "BRENT /bbl",
        "an oil exporter"
      ],
      [
        "WTI /bbl",
        "an oil exporter"
      ]
    ],
    "Algeria": [
      [
        "BRENT /bbl",
        "an oil exporter"
      ],
      [
        "WTI /bbl",
        "an oil exporter"
      ]
    ],
    "Norway": [
      [
        "BRENT /bbl",
        "an oil exporter"
      ],
      [
        "WTI /bbl",
        "an oil exporter"
      ]
    ],
    "Oman": [
      [
        "BRENT /bbl",
        "an oil exporter"
      ],
      [
        "WTI /bbl",
        "an oil exporter"
      ]
    ],
    "Qatar": [
      [
        "NATGAS /MMBtu",
        "a leading LNG exporter"
      ],
      [
        "BRENT /bbl",
        "an oil exporter"
      ]
    ],
    "Chile": [
      [
        "COPPER /lb",
        "the largest copper producer"
      ],
      [
        "LITHIUM·LIT",
        "a leading lithium producer"
      ]
    ],
    "Peru": [
      [
        "COPPER /lb",
        "a major copper producer"
      ]
    ],
    "Dem. Rep. Congo": [
      [
        "COPPER /lb",
        "a major copper producer"
      ]
    ],
    "Zambia": [
      [
        "COPPER /lb",
        "a major copper producer"
      ]
    ],
    "South Africa": [
      [
        "PLATINUM /oz",
        "the largest platinum producer"
      ],
      [
        "GOLD /oz",
        "a gold producer"
      ]
    ],
    "Niger": [
      [
        "URANIUM·URA",
        "a uranium producer"
      ]
    ]
  },
  "broad": [
    [
      "GOLD /oz",
      "a safe haven"
    ],
    [
      "VIX",
      "the market's fear gauge"
    ],
    [
      "DEFENSE·ITA",
      "defence shares"
    ]
  ],
  "y": {
    "BRENT /bbl": "BZ=F",
    "WTI /bbl": "CL=F",
    "ENERGY·XLE": "XLE",
    "NATGAS /MMBtu": "NG=F",
    "WHEAT /bu": "ZW=F",
    "GOLD /oz": "GC=F",
    "VIX": "^VIX",
    "DEFENSE·ITA": "ITA",
    "JAPAN·EWJ": "EWJ",
    "CHINA·MCHI": "MCHI",
    "HONGKONG·EWH": "EWH",
    "INDIA·INDA": "INDA",
    "BRAZIL·EWZ": "EWZ",
    "UK·EWU": "EWU",
    "GERMANY·EWG": "EWG",
    "EURO50·FEZ": "FEZ",
    "SEMIS·SMH": "SMH",
    "TECH·XLK": "XLK",
    "COPPER /lb": "HG=F",
    "PLATINUM /oz": "PL=F",
    "S&P500·SPY": "SPY",
    "DXY": "DX-Y.NYB",
    "EU GAS /MWh": "TTF=F",
    "EUR/USD": "EURUSD=X",
    "GBP/USD": "GBPUSD=X",
    "AUD/USD": "AUDUSD=X",
    "USD/JPY": "USDJPY=X",
    "USD/CHF": "USDCHF=X",
    "USD/CAD": "USDCAD=X",
    "USD/CNY": "USDCNY=X",
    "USD/INR": "USDINR=X",
    "USD/TRY": "USDTRY=X",
    "OIL VOL·OVX": "^OVX",
    "FRONTLINE·FRO": "FRO",
    "SCORPIO·STNG": "STNG",
    "ZIM": "ZIM",
    "MAERSK·AMKBY": "AMKBY",
    "CORN /bu": "ZC=F",
    "SOYBEANS /bu": "ZS=F",
    "RICE /cwt": "ZR=F",
    "URANIUM·URA": "URA",
    "LITHIUM·LIT": "LIT",
    "RARE EARTHS·REMX": "REMX"
  },
  "topics": [
    {
      "name": "rare earths and strategic metals",
      "match": "\\b(rare[- ]earths?|critical minerals?|strategic metals?|gallium|germanium|graphite|antimony|tungsten)\\b",
      "syms": [
        [
          "RARE EARTHS·REMX",
          "rare earths and strategic metals"
        ]
      ]
    },
    {
      "name": "lithium and batteries",
      "match": "\\b(lithium|battery metals?)\\b",
      "syms": [
        [
          "LITHIUM·LIT",
          "lithium"
        ]
      ]
    },
    {
      "name": "uranium and nuclear fuel",
      "match": "\\b(uranium|yellowcake|nuclear fuel)\\b",
      "syms": [
        [
          "URANIUM·URA",
          "uranium"
        ]
      ]
    },
    {
      "name": "chips",
      "match": "\\b(semiconductors?|chipmakers?|chip exports?)\\b",
      "syms": [
        [
          "SEMIS·SMH",
          "chips"
        ]
      ]
    },
    {
      "name": "oil tankers",
      "match": "\\btankers?\\b",
      "syms": [
        [
          "FRONTLINE·FRO",
          "oil tankers"
        ],
        [
          "SCORPIO·STNG",
          "fuel tankers"
        ]
      ]
    },
    {
      "name": "container shipping",
      "match": "\\b(container (ships?|vessels?|lines?)|shipping lines?|freight rates?)\\b",
      "syms": [
        [
          "ZIM",
          "container shipping"
        ],
        [
          "MAERSK·AMKBY",
          "container shipping"
        ]
      ]
    },
    {
      "name": "grain and food",
      "match": "\\b(grain|wheat|corn|maize|soy(beans?)?|rice|fertili[sz]ers?|food prices?)\\b",
      "syms": [
        [
          "WHEAT /bu",
          "grain"
        ],
        [
          "CORN /bu",
          "grain"
        ]
      ]
    }
  ]
};

// REROUTES: the way round each strait, for the reroute calculator (lib/app/reroute.js).
//    `lines` are sea routes as [lon, lat] waypoints, drawn and measured as great-circle legs. Their
//    lengths are within about 2% of published port-to-port distances; they are approximations for
//    comparing routes, not for navigation. `speeds` are in knots.
const REROUTES = {
  speeds: [12,14,16,20],
  voyages: {
    "gulf_europe": {
        "name": "Gulf → north-west Europe",
        "ports": "Ras Tanura to Rotterdam",
        "cargo": "crude oil and fuel"
    },
    "asia_europe": {
        "name": "East Asia → north-west Europe",
        "ports": "Shanghai to Rotterdam",
        "cargo": "containers"
    },
    "gulf_asia": {
        "name": "Gulf → East Asia",
        "ports": "Ras Tanura to Tokyo Bay",
        "cargo": "crude oil and LNG"
    },
    "usgulf_asia": {
        "name": "US Gulf → East Asia",
        "ports": "Houston to Tokyo Bay",
        "cargo": "LNG, LPG and grain"
    },
    "sin_sha": {
        "name": "Singapore → Shanghai",
        "ports": "Singapore to Shanghai",
        "cargo": "containers and oil"
    }
  },
  straits: {
    "hormuz": {
        "none": "There is no other sea exit from the Gulf."
    },
    "bab-el-mandeb": {
        "alts": [
            {
                "voyage": "gulf_europe",
                "base": "gulf_europe_suez",
                "alt": "gulf_europe_cape",
                "via": "round the Cape of Good Hope"
            },
            {
                "voyage": "asia_europe",
                "base": "asia_europe_suez",
                "alt": "asia_europe_cape",
                "via": "round the Cape of Good Hope"
            }
        ]
    },
    "suez": {
        "alts": [
            {
                "voyage": "gulf_europe",
                "base": "gulf_europe_suez",
                "alt": "gulf_europe_cape",
                "via": "round the Cape of Good Hope"
            },
            {
                "voyage": "asia_europe",
                "base": "asia_europe_suez",
                "alt": "asia_europe_cape",
                "via": "round the Cape of Good Hope"
            }
        ]
    },
    "malacca": {
        "alts": [
            {
                "voyage": "gulf_asia",
                "base": "gulf_asia_malacca",
                "alt": "gulf_asia_lombok",
                "via": "by the Lombok and Makassar straits"
            },
            {
                "voyage": "asia_europe",
                "base": "asia_europe_suez",
                "alt": "asia_europe_sunda",
                "via": "by the Sunda Strait"
            }
        ]
    },
    "panama": {
        "alts": [
            {
                "voyage": "usgulf_asia",
                "base": "usgulf_asia_panama",
                "alt": "usgulf_asia_cape",
                "via": "round the Cape of Good Hope"
            }
        ]
    },
    "taiwan": {
        "alts": [
            {
                "voyage": "sin_sha",
                "base": "sin_sha_strait",
                "alt": "sin_sha_east",
                "via": "east of Taiwan"
            }
        ]
    },
    "bosphorus": {
        "none": "There is no other sea exit from the Black Sea."
    },
    "kerch": {
        "none": "There is no other sea exit from the Sea of Azov."
    }
  },
  lines: {
    gulf_europe_suez: [[50.3,26.8],[51.6,26.6],[53.5,26.1],[55.6,26.3],[56.55,26.6],[57.8,25.3],[60.1,22.6],[59.6,20.3],[56,16.6],[52,13.6],[45.5,12.1],[43.3,12.55],[42.4,14.5],[40.5,17.5],[38,21.5],[35.6,25.5],[34,27.6],[32.6,29.9],[32.35,31.3],[24,34.3],[14.6,35.5],[11.4,37.5],[9.5,37.9],[3,37.5],[-2,36.4],[-5.6,35.95],[-9.4,36.8],[-10,38.7],[-9.9,43.3],[-5.9,48.7],[-2,50],[1.5,51.05],[3,51.9],[4,52]],
    gulf_europe_cape: [[50.3,26.8],[51.6,26.6],[53.5,26.1],[55.6,26.3],[56.55,26.6],[57.8,25.3],[60.1,22.6],[57,12],[50,0],[42,-10.5],[41,-17],[37.5,-23.5],[35.5,-26.5],[31.6,-30.4],[28.5,-33.6],[20,-35.3],[18.2,-34.8],[17.3,-33.5],[-13.5,6],[-18,14.5],[-17.8,21],[-18.8,28],[-10.2,38.5],[-9.9,43.3],[-5.9,48.7],[-2,50],[1.5,51.05],[3,51.9],[4,52]],
    asia_europe_suez: [[122.3,30.6],[121.3,27],[119.9,24.8],[119,23.5],[117.8,22],[113.5,15.5],[110,9.5],[105,3],[104.5,1.35],[103.8,1.2],[103.3,1.15],[101.3,2.6],[99,4.6],[95.3,6.2],[80.6,5.6],[73,7.7],[53,13.2],[45.5,12.1],[43.3,12.55],[42.4,14.5],[40.5,17.5],[38,21.5],[35.6,25.5],[34,27.6],[32.6,29.9],[32.35,31.3],[24,34.3],[14.6,35.5],[11.4,37.5],[9.5,37.9],[3,37.5],[-2,36.4],[-5.6,35.95],[-9.4,36.8],[-10,38.7],[-9.9,43.3],[-5.9,48.7],[-2,50],[1.5,51.05],[3,51.9],[4,52]],
    asia_europe_cape: [[122.3,30.6],[121.3,27],[119.9,24.8],[119,23.5],[117.8,22],[113.5,15.5],[110,9.5],[105,3],[104.5,1.35],[103.8,1.2],[103.3,1.15],[101.3,2.6],[99,4.6],[95.3,6.2],[60,-20],[48,-27.5],[33,-30.5],[28.5,-33.6],[20,-35.3],[18.2,-34.8],[17.3,-33.5],[-13.5,6],[-18,14.5],[-17.8,21],[-18.8,28],[-10.2,38.5],[-9.9,43.3],[-5.9,48.7],[-2,50],[1.5,51.05],[3,51.9],[4,52]],
    asia_europe_sunda: [[122.3,30.6],[121.3,27],[119.9,24.8],[119,23.5],[117.8,22],[113.5,15.5],[110,9.5],[107,2],[108.7,-1.6],[107,-4.6],[105.6,-6.2],[104.5,-7],[73.3,1.4],[53,13.2],[45.5,12.1],[43.3,12.55],[42.4,14.5],[40.5,17.5],[38,21.5],[35.6,25.5],[34,27.6],[32.6,29.9],[32.35,31.3],[24,34.3],[14.6,35.5],[11.4,37.5],[9.5,37.9],[3,37.5],[-2,36.4],[-5.6,35.95],[-9.4,36.8],[-10,38.7],[-9.9,43.3],[-5.9,48.7],[-2,50],[1.5,51.05],[3,51.9],[4,52]],
    gulf_asia_malacca: [[50.3,26.8],[51.6,26.6],[53.5,26.1],[55.6,26.3],[56.55,26.6],[57.8,25.3],[60.1,22.6],[73,7.7],[80.6,5.6],[95.3,6.2],[99,4.6],[101.3,2.6],[103.3,1.15],[103.8,1.2],[104.5,1.35],[105,3],[110,9.5],[113.5,15.5],[121.5,21.3],[130,25],[138.5,33],[139.75,34.95]],
    gulf_asia_lombok: [[50.3,26.8],[51.6,26.6],[53.5,26.1],[55.6,26.3],[56.55,26.6],[57.8,25.3],[60.1,22.6],[73,7.7],[80.6,5.6],[97,-3],[105,-8.5],[115,-9.5],[115.75,-8.7],[116.8,-6],[117.8,-4],[118.4,-1],[119.5,1.2],[120.5,3],[124,4.5],[126.2,4.9],[128,6.5],[133,20],[138.5,33],[139.75,34.95]],
    usgulf_asia_panama: [[-94.7,29.3],[-85.8,21.8],[-81.5,13.5],[-79.9,9.4],[-79.5,8.9],[-80,7],[-88,10.5],[-95,14],[-106,19],[-110.8,22.4],[-118.5,30],[141.6,35.6],[140,34.6],[139.75,34.95]],
    usgulf_asia_cape: [[-94.7,29.3],[-84.5,24.3],[-80.5,24.35],[-79.6,26],[-78.5,26.3],[-77.3,25.6],[-76.5,25.7],[-58,17],[-34,-6],[17.3,-33.5],[18.2,-34.8],[20,-35.3],[104.5,-7],[105.6,-6.2],[107,-4.6],[108.7,-1.6],[107,2],[110,9.5],[113.5,15.5],[121.5,21.3],[130,25],[138.5,33],[139.75,34.95]],
    sin_sha_strait: [[103.8,1.2],[104.5,1.35],[105,3],[110,9.5],[113.5,15.5],[117.8,22],[119,23.5],[119.9,24.8],[121.3,27],[122.3,30.6]],
    sin_sha_east: [[103.8,1.2],[104.5,1.35],[105,3],[110,9.5],[113.5,15.5],[121.3,21.4],[122.4,24.5],[122.8,27],[122.6,30.4],[122.3,30.6]],
  },
};

// STRAIT_FACTS: what moves through each strait, who depends on it and what the way round is, for the
//    "close a strait" scenario (lib/app/sandbox.js). Public figures, each with its year; `oilMbd` is
//    million barrels a day. Update the figures when the EIA updates its table.
const STRAIT_FACTS = {
  "asOf": "Oil volumes: US Energy Information Administration, World Oil Transit Chokepoints (updated March 2026; figures for the first half of 2025 unless a year is given).",
  "worldMbd": 104.4,
  "hormuz": {
    "name": "Strait of Hormuz",
    "oilMbd": 20.9,
    "bypassMbd": 2.6,
    "flow": "About 20.9 million barrels of oil a day, roughly a quarter of all oil moved by sea, and about a fifth of the world's LNG trade (2024), almost all of it from Qatar.",
    "who": "In 2024, 84% of the crude through it went to Asia; China, India, Japan and South Korea took 69% between them. 83% of its LNG went to Asia too.",
    "around": "Two pipelines avoid the strait: Saudi Arabia's East-West line to Yanbu on the Red Sea (5 million barrels a day) and the UAE's line to Fujairah (1.8 million). The EIA estimates about 2.6 million barrels a day could be redirected in a disruption.",
    "past": "In the 1980s Tanker War ships were attacked for years, and the strait stayed open.",
    "syms": [
      "BRENT /bbl",
      "WTI /bbl",
      "ENERGY·XLE",
      "NATGAS /MMBtu",
      "FRONTLINE·FRO"
    ]
  },
  "bab-el-mandeb": {
    "name": "Bab-el-Mandeb",
    "oilMbd": 4.2,
    "flow": "About 4.2 million barrels of oil a day, down from 9.3 million in 2023, before the attacks on shipping in the Red Sea.",
    "who": "Trade between Asia and Europe, Gulf oil and fuel bound for Europe, and Russian oil bound for India and China.",
    "around": "Ships go round the Cape of Good Hope instead. Oil moving round the Cape rose from 6.2 million barrels a day in 2023 to 9.3 million in 2024.",
    "past": "From late 2023, attacks on ships in the Red Sea sent many shipping lines round Africa.",
    "syms": [
      "BRENT /bbl",
      "WTI /bbl",
      "EUR/USD",
      "ZIM",
      "MAERSK·AMKBY"
    ]
  },
  "suez": {
    "name": "Suez Canal",
    "oilMbd": 4.9,
    "flow": "About 4.9 million barrels of oil a day through the canal and the SUMED pipeline, down from 8.8 million in 2023. In normal times about 12 to 15% of world trade.",
    "who": "The short route between Asia and Europe, for containers, oil, fuel and gas.",
    "around": "The Cape of Good Hope. The SUMED pipeline across Egypt carries crude past the canal, but no other cargo.",
    "past": "In March 2021 the container ship Ever Given blocked the canal for six days.",
    "syms": [
      "BRENT /bbl",
      "WTI /bbl",
      "EUR/USD",
      "MAERSK·AMKBY"
    ]
  },
  "malacca": {
    "name": "Strait of Malacca",
    "oilMbd": 23.2,
    "flow": "About 23.2 million barrels of oil a day: the busiest oil strait in the world, and about 29% of all oil moved by sea.",
    "who": "Oil from the Gulf and Africa on its way to China, Japan and South Korea, and container trade between East Asia, India and Europe.",
    "around": "The Sunda Strait is shallower and suits smaller ships. The Lombok and Makassar straits take the largest tankers, at the cost of extra days.",
    "past": "",
    "syms": [
      "BRENT /bbl",
      "WTI /bbl",
      "USD/CNY",
      "USD/JPY"
    ]
  },
  "bosphorus": {
    "name": "Bosphorus",
    "oilMbd": 3.7,
    "flow": "About 3.7 million barrels of oil a day through the Turkish Straits, and the grain exports of the Black Sea.",
    "who": "Russian and Kazakh crude loaded near Novorossiysk, and wheat and maize from Ukraine, Russia, Romania and Bulgaria.",
    "around": "Some oil can move by pipeline and some grain by rail or the Danube, in far smaller volumes.",
    "past": "",
    "syms": [
      "WHEAT /bu",
      "BRENT /bbl"
    ]
  },
  "panama": {
    "name": "Panama Canal",
    "oilMbd": 2.3,
    "flow": "About 2.3 million barrels of oil and fuel a day, and about 5% of world sea trade.",
    "who": "US Gulf exports of fuel, gas and grain to Asia, and trade between Asia and the US East Coast.",
    "around": "Round the Cape of Good Hope or through Suez for the US Gulf to Asia trade; round Cape Horn for the west coast of South America.",
    "past": "In the 2023-24 drought the canal cut daily transits from about 36 to as few as 22.",
    "syms": [
      "NATGAS /MMBtu",
      "WHEAT /bu"
    ]
  },
  "taiwan": {
    "name": "Taiwan Strait",
    "oilMbd": null,
    "flow": "About a fifth of world sea trade by value: an estimated 2.45 trillion dollars of goods in 2022 (CSIS).",
    "who": "The trade of China, Japan, South Korea and Taiwan itself, which makes most of the world's most advanced chips.",
    "around": "Ships can pass east of Taiwan, which adds little distance. The cost of a closure would come from Taiwan's own ports and factories, not from the detour.",
    "past": "",
    "syms": [
      "SEMIS·SMH",
      "TECH·XLK",
      "USD/CNY",
      "CHINA·MCHI"
    ]
  },
  "kerch": {
    "name": "Kerch Strait",
    "oilMbd": null,
    "flow": "The only way in and out of the Sea of Azov.",
    "who": "The Azov ports: Rostov, Azov and Taganrog in Russia, and Mariupol and Berdiansk, under Russian control since 2022.",
    "around": "Cargo would have to move overland to Black Sea ports.",
    "past": "",
    "syms": [
      "WHEAT /bu"
    ]
  }
};


/* expose to modules: top-level const is not a window property */
window.BLOCKADES = BLOCKADES;
window.CARRIER_GROUPS = CARRIER_GROUPS;
window.COMMODITY_FLOWS = COMMODITY_FLOWS;
window.CONFLICT_ZONES = CONFLICT_ZONES;
window.DATA_CENTERS = DATA_CENTERS;
window.DISPLACEMENT_FLOWS = DISPLACEMENT_FLOWS;
window.ENERGY_EXPOSURE = ENERGY_EXPOSURE;
window.GPS_JAM_ZONES = GPS_JAM_ZONES;
window.IAEA_IRRADIATORS = IAEA_IRRADIATORS;
window.INFRA_INCIDENTS = INFRA_INCIDENTS;
window.MARKET_LINKS = MARKET_LINKS;
window.NUCLEAR_META = NUCLEAR_META;
window.NUCLEAR_SITES = NUCLEAR_SITES;
window.RADIATION_SITES = RADIATION_SITES;
window.RADNET_STATIONS = RADNET_STATIONS;
window.RELIGION_DATA = RELIGION_DATA;
window.REROUTES = REROUTES;
window.STRAIT_FACTS = STRAIT_FACTS;
window.UNDERSEA_CABLES = UNDERSEA_CABLES;
window.WORLD_CITIES = WORLD_CITIES;
window.WORLD_PORTS = WORLD_PORTS;
