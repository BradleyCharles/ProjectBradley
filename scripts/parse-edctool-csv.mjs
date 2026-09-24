// One-time import script: parses the "Colonization Construction v3 (By DaftMav) -
// Commodities" CSV (docs/) into a structured TS data file consumed by /edctool.
// Re-run with `node scripts/parse-edctool-csv.mjs` whenever the source CSV changes.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.join(
  __dirname,
  "..",
  "docs",
  "Colonization Construction v3 (By DaftMav) - Commodities.csv"
);
const OUT_PATH = path.join(__dirname, "..", "src", "data", "edctoolData.ts");

/** Minimal RFC4180 CSV parser (handles quoted fields containing commas/newlines). */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\r") {
      // ignore, \n handles the line break
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const raw = readFileSync(CSV_PATH, "utf-8").replace(/^﻿/, "");
const rows = parseCsv(raw);
const header = rows[0];

const COMMODITY_NAME_COL = 4; // Column E
const BASE_START_COL = 15; // Column P
const BASE_END_COL = 69; // last "Surface - Hub" column, inclusive
const PRIMARY_START_COL = 90;
const PRIMARY_END_COL = 100; // inclusive

function stripPrimarySuffix(label) {
  return label.replace(/\s*\(Primary\)\s*$/, "").trim();
}

function formatTypeName(rawType) {
  const settlementMatch = rawType.match(/^(.*) T([12]) (S|M|L)$/);
  if (settlementMatch) {
    const [, name, tier, size] = settlementMatch;
    const sizeLabel = { S: "Small", M: "Medium", L: "Large" }[size];
    return `${name} — Tier ${tier}, ${sizeLabel}`;
  }
  return rawType;
}

function parseColumnHeader(label) {
  const clean = stripPrimarySuffix(label);
  const parts = clean.split(" - ").map((p) => p.trim());
  if (parts.length < 3) return null;
  const [area, kind, ...rest] = parts;
  const rawType = rest.join(" - ");
  return {
    category: `${area} ${kind}`,
    typeName: formatTypeName(rawType),
    rawLabel: clean,
  };
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Build base facility columns: { colIndex, category, typeName, rawLabel }
const baseColumns = [];
for (let c = BASE_START_COL; c <= BASE_END_COL; c++) {
  const label = header[c];
  if (!label) continue;
  const parsed = parseColumnHeader(label);
  if (!parsed) continue;
  baseColumns.push({ colIndex: c, ...parsed });
}

// Build primary columns, matched back to their base column by rawLabel.
const primaryColumns = [];
for (let c = PRIMARY_START_COL; c <= PRIMARY_END_COL; c++) {
  const label = header[c];
  if (!label) continue;
  const parsed = parseColumnHeader(label);
  if (!parsed) continue;
  primaryColumns.push({ colIndex: c, ...parsed });
}

function parseTonnage(cell) {
  if (!cell) return 0;
  const n = Number(cell.replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

// Collect commodity data rows: Normal (col0) non-empty AND Category (col3) empty.
const dataRows = rows
  .slice(1)
  .filter((r) => (r[0] || "").trim() !== "" && (r[3] || "").trim() === "");

// facilities: Map<rawLabel, { category, typeName, hasPrimary, base: [], primary: [] }>
const facilities = new Map();
for (const col of baseColumns) {
  facilities.set(col.rawLabel, {
    category: col.category,
    typeName: col.typeName,
    hasPrimary: false,
    base: [],
    primary: [],
  });
}

for (const row of dataRows) {
  const commodity = (row[COMMODITY_NAME_COL] || "").trim();
  if (!commodity) continue;

  for (const col of baseColumns) {
    const tonnage = parseTonnage(row[col.colIndex]);
    if (tonnage > 0) {
      facilities.get(col.rawLabel).base.push({ commodity, tonnage });
    }
  }

  for (const col of primaryColumns) {
    const facility = facilities.get(col.rawLabel);
    if (!facility) continue; // shouldn't happen — primary always maps to a base column
    const tonnage = parseTonnage(row[col.colIndex]);
    if (tonnage > 0) {
      facility.hasPrimary = true;
      facility.primary.push({ commodity, tonnage });
    }
  }
}

const CATEGORY_ORDER = [
  "Orbital Starport",
  "Orbital Outpost",
  "Orbital Installation",
  "Surface Planetary Port",
  "Surface Settlement",
  "Surface Hub",
];

// Preserve original CSV column order within each category.
const orderIndex = new Map(baseColumns.map((c, i) => [c.rawLabel, i]));
const facilityTypes = [...facilities.entries()]
  .map(([rawLabel, f]) => ({
    key: slugify(`${f.category}-${f.typeName}`),
    category: f.category,
    name: f.typeName,
    hasPrimary: f.hasPrimary,
    base: f.base,
    primary: f.primary,
    _rawLabel: rawLabel,
  }))
  .sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.category);
    const bi = CATEGORY_ORDER.indexOf(b.category);
    if (ai !== bi) return ai - bi;
    return (orderIndex.get(a._rawLabel) ?? 0) - (orderIndex.get(b._rawLabel) ?? 0);
  })
  .map(({ _rawLabel, ...f }) => f);

const banner = `// AUTO-GENERATED by scripts/parse-edctool-csv.mjs — do not edit by hand.
// Source: docs/Colonization Construction v3 (By DaftMav) - Commodities.csv
// Regenerate with: node scripts/parse-edctool-csv.mjs
`;

const ts = `${banner}
export interface CommodityRequirement {
  commodity: string;
  tonnage: number;
}

export interface FacilityType {
  key: string;
  category: string;
  name: string;
  hasPrimary: boolean;
  base: CommodityRequirement[];
  primary: CommodityRequirement[];
}

export const FACILITY_CATEGORIES = ${JSON.stringify(CATEGORY_ORDER, null, 2)} as const;

export const FACILITY_TYPES: FacilityType[] = ${JSON.stringify(facilityTypes, null, 2)};
`;

writeFileSync(OUT_PATH, ts, "utf-8");
console.log(`Wrote ${facilityTypes.length} facility types to ${path.relative(process.cwd(), OUT_PATH)}`);
for (const f of facilityTypes) {
  console.log(
    `  ${f.category} / ${f.name} — base:${f.base.length} commodities${f.hasPrimary ? `, primary:${f.primary.length}` : ""}`
  );
}
