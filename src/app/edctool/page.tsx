"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "../../styles/edctool.module.css";
import {
  FACILITY_CATEGORIES,
  FACILITY_TYPES,
  type FacilityType,
} from "@/data/edctoolData";

/* ── Body class ─────────────────────────────────────────── */
function useEdcToolBodyClass() {
  useEffect(() => {
    document.body.classList.add("edctool-page");
    return () => document.body.classList.remove("edctool-page");
  }, []);
}

/* ── Types ──────────────────────────────────────────────── */
type CarrierType = "none" | "fleet" | "squadron";

const CARRIER_DEFAULT_CAPACITY: Record<CarrierType, number | null> = {
  none: null,
  fleet: 25000,
  squadron: 60000,
};

interface SavedState {
  carrierType: CarrierType;
  carrierCapacity: string;
  shipCapacity: string;
  facilityKey: string | null;
  isPrimary: boolean;
  premiumPct: number;
  progress: Record<string, number>;
  checkpoints: Record<string, number>;
}

const STORAGE_KEY = "edctool-state-v1";

const DEFAULT_STATE: SavedState = {
  carrierType: "none",
  carrierCapacity: "",
  shipCapacity: "",
  facilityKey: null,
  isPrimary: false,
  premiumPct: 0,
  progress: {},
  checkpoints: {},
};

const FACILITIES_BY_CATEGORY = new Map<string, FacilityType[]>(
  FACILITY_CATEGORIES.map((cat) => [
    cat,
    FACILITY_TYPES.filter((f) => f.category === cat),
  ])
);

/* ── Helpers ────────────────────────────────────────────── */
function parseNonNegative(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString();
}

/* ── Page ───────────────────────────────────────────────── */
export default function EdcToolPage() {
  useEdcToolBodyClass();

  const [state, setState] = useState<SavedState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  // Load persisted state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState({ ...DEFAULT_STATE, ...(JSON.parse(saved) as SavedState) });
      }
    } catch {
      /* ignore */
    } finally {
      setLoaded(true);
    }
  }, []);

  // Persist state
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, loaded]);

  const facility = useMemo(
    () => FACILITY_TYPES.find((f) => f.key === state.facilityKey) ?? null,
    [state.facilityKey]
  );

  const requirements = useMemo(() => {
    if (!facility) return [];
    return facility.hasPrimary && state.isPrimary ? facility.primary : facility.base;
  }, [facility, state.isPrimary]);

  const shipCapacityNum = parseNonNegative(state.shipCapacity);
  const carrierCapacityNum = parseNonNegative(state.carrierCapacity);
  const runsEnabled = shipCapacityNum > 0;

  const hasAnyProgress = Object.values(state.progress).some((v) => v > 0);

  /* ── Setup actions ────────────────────────────────────── */
  const changeFacility = (key: string) => {
    if (key === state.facilityKey) return;
    if (
      hasAnyProgress &&
      !window.confirm(
        "Switching facility type will clear your logged progress for the current build. Continue?"
      )
    ) {
      return;
    }
    setState((s) => ({
      ...s,
      facilityKey: key || null,
      isPrimary: false,
      progress: {},
      checkpoints: {},
    }));
  };

  const changePrimary = (isPrimary: boolean) => {
    if (isPrimary === state.isPrimary) return;
    if (
      hasAnyProgress &&
      !window.confirm(
        "Switching between Primary Port and Non-Primary requirements will clear your logged progress for the current build. Continue?"
      )
    ) {
      return;
    }
    setState((s) => ({ ...s, isPrimary, progress: {}, checkpoints: {} }));
  };

  const changeCarrierType = (carrierType: CarrierType) => {
    setState((s) => {
      const knownDefaults = new Set(
        Object.values(CARRIER_DEFAULT_CAPACITY)
          .filter((v): v is number => v !== null)
          .map(String)
      );
      const shouldAutofill = s.carrierCapacity === "" || knownDefaults.has(s.carrierCapacity);
      const nextDefault = CARRIER_DEFAULT_CAPACITY[carrierType];
      return {
        ...s,
        carrierType,
        carrierCapacity:
          shouldAutofill && nextDefault !== null ? String(nextDefault) : s.carrierCapacity,
      };
    });
  };

  /* ── Row actions ──────────────────────────────────────── */
  const targetFor = (baseTonnage: number) =>
    Math.round(baseTonnage * (1 + state.premiumPct / 100));

  const setCollected = (commodity: string, value: number) => {
    const clamped = Math.max(0, value);
    setState((s) => ({
      ...s,
      progress: { ...s.progress, [commodity]: clamped },
    }));
  };

  const addRun = (commodity: string, sign: 1 | -1) => {
    if (!runsEnabled) return;
    const current = state.progress[commodity] ?? 0;
    setCollected(commodity, current + sign * shipCapacityNum);
  };

  const resetRow = (commodity: string) => {
    const current = state.progress[commodity] ?? 0;
    if (current <= 0) return;
    if (
      !window.confirm(
        `Reset ${commodity} progress back to 0T? This can't be undone.`
      )
    ) {
      return;
    }
    setState((s) => {
      const progress = { ...s.progress };
      const checkpoints = { ...s.checkpoints };
      delete progress[commodity];
      delete checkpoints[commodity];
      return { ...s, progress, checkpoints };
    });
  };

  const toggleCheckbox = (commodity: string, target: number, checked: boolean) => {
    const current = state.progress[commodity] ?? 0;
    if (checked) {
      setState((s) => ({
        ...s,
        checkpoints: { ...s.checkpoints, [commodity]: current },
        progress: { ...s.progress, [commodity]: target },
      }));
    } else {
      const checkpoint = state.checkpoints[commodity];
      if (checkpoint === undefined) return; // nothing to reverse safely
      setState((s) => {
        const checkpoints = { ...s.checkpoints };
        delete checkpoints[commodity];
        return {
          ...s,
          checkpoints,
          progress: { ...s.progress, [commodity]: checkpoint },
        };
      });
    }
  };

  /* ── Totals ───────────────────────────────────────────── */
  const totals = useMemo(() => {
    let remaining = 0;
    for (const req of requirements) {
      const target = targetFor(req.tonnage);
      const collected = state.progress[req.commodity] ?? 0;
      remaining += Math.max(0, target - collected);
    }
    const trips = shipCapacityNum > 0 ? Math.ceil(remaining / shipCapacityNum) : null;
    return { remaining, trips };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirements, state.progress, state.premiumPct, shipCapacityNum]);

  return (
    <div className={styles.page}>
      {/* ── Header ────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1>COLONIZATION HAULING TRACKER</h1>
          <p>ELITE DANGEROUS // CONSTRUCTION MATERIALS LOGISTICS</p>
        </div>
      </header>

      {/* ── Sticky summary bar ──────────────────────────────── */}
      <div className={styles.summaryBar}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Facility</span>
          <span className={styles.summaryValue}>
            {facility ? `${facility.category} — ${facility.name}` : "None selected"}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Remaining</span>
          <span className={styles.summaryValue}>
            {facility ? `${fmt(totals.remaining)}T` : "—"}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Trips Remaining</span>
          <span className={styles.summaryValue}>
            {facility && totals.trips !== null ? totals.trips.toLocaleString() : "—"}
          </span>
        </div>
      </div>

      <div className={styles.main}>
        {/* ── Setup panel ─────────────────────────────────── */}
        <section className={styles.setupPanel} aria-label="Setup">
          <h2 className={styles.panelTitle}>Configure Once</h2>

          <div className={styles.setupGrid}>
            {/* Carrier selector */}
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="carrier-type">
                Carrier
              </label>
              <div className={styles.btnGroup} role="group" aria-label="Carrier type">
                {(
                  [
                    { key: "none", label: "None" },
                    { key: "fleet", label: "Fleet Carrier" },
                    { key: "squadron", label: "Squadron Carrier" },
                  ] as { key: CarrierType; label: string }[]
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    className={[
                      styles.btnGroupBtn,
                      state.carrierType === key ? styles.btnGroupBtnActive : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-pressed={state.carrierType === key}
                    onClick={() => changeCarrierType(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Carrier capacity (conditional) */}
            {state.carrierType !== "none" && (
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="carrier-capacity">
                  Carrier cargo capacity (tons)
                </label>
                <input
                  id="carrier-capacity"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder={
                    state.carrierType === "squadron" ? "e.g. 60000" : "e.g. 25000"
                  }
                  value={state.carrierCapacity}
                  onChange={(e) =>
                    setState((s) => ({ ...s, carrierCapacity: e.target.value }))
                  }
                  className={styles.numberInput}
                />
                <p className={styles.fieldHint}>
                  Defaults to the max for your carrier type (Fleet: 25,000T,
                  Squadron: 60,000T) — adjust if your cargo module loadout
                  differs.
                </p>
              </div>
            )}

            {/* Ship capacity — always visible */}
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="ship-capacity">
                Your hauler&apos;s cargo capacity (tons)
              </label>
              <input
                id="ship-capacity"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="e.g. 784"
                value={state.shipCapacity}
                onChange={(e) => setState((s) => ({ ...s, shipCapacity: e.target.value }))}
                className={styles.numberInput}
              />
              <p className={styles.fieldHint}>
                The ship that actually buys and delivers cargo, even when a
                carrier is staging the bulk.
              </p>
            </div>

            {/* Facility type selector */}
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="facility-type">
                Facility type
              </label>
              <select
                id="facility-type"
                className={styles.selectInput}
                value={state.facilityKey ?? ""}
                onChange={(e) => changeFacility(e.target.value)}
              >
                <option value="">— Select a facility type —</option>
                {FACILITY_CATEGORIES.map((cat) => (
                  <optgroup key={cat} label={cat}>
                    {(FACILITIES_BY_CATEGORY.get(cat) ?? []).map((f) => (
                      <option key={f.key} value={f.key}>
                        {f.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Primary toggle (Starports/Outposts only) */}
            {facility?.hasPrimary && (
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Port role</label>
                <div className={styles.btnGroup} role="group" aria-label="Primary port toggle">
                  <button
                    type="button"
                    className={[
                      styles.btnGroupBtn,
                      !state.isPrimary ? styles.btnGroupBtnActive : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-pressed={!state.isPrimary}
                    onClick={() => changePrimary(false)}
                  >
                    Non-Primary
                  </button>
                  <button
                    type="button"
                    className={[
                      styles.btnGroupBtn,
                      state.isPrimary ? styles.btnGroupBtnActive : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-pressed={state.isPrimary}
                    onClick={() => changePrimary(true)}
                  >
                    Primary Port
                  </button>
                </div>
                <p className={styles.fieldHint}>
                  Primary ports require different tonnage than later expansions.
                </p>
              </div>
            )}

            {/* Premium slider */}
            <div className={`${styles.field} ${styles.fieldWide}`}>
              <label className={styles.fieldLabel} htmlFor="premium-slider">
                Premium — real manifests run above baseline ({state.premiumPct}%)
              </label>
              <div className={styles.sliderRow}>
                <input
                  id="premium-slider"
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={state.premiumPct}
                  onChange={(e) =>
                    setState((s) => ({ ...s, premiumPct: Number(e.target.value) }))
                  }
                  className={styles.slider}
                />
                <span className={styles.sliderValue}>{state.premiumPct}%</span>
              </div>
              <p className={styles.fieldHint}>
                Slide up until the totals below match what the game actually
                shows you, once the real numbers are revealed in-game.
              </p>
            </div>
          </div>

          {carrierCapacityNum > 0 && state.carrierType !== "none" && (
            <p className={styles.carrierNote}>
              {state.carrierType === "fleet" ? "Fleet Carrier" : "Squadron Carrier"}{" "}
              capacity set to {fmt(carrierCapacityNum)}T.
            </p>
          )}
        </section>

        {/* ── Tracking list ───────────────────────────────── */}
        <section className={styles.trackingPanel} aria-label="Commodity tracking">
          <h2 className={styles.panelTitle}>Work The List</h2>

          {!facility && (
            <p className={styles.emptyState}>
              Select a facility type above to generate its required commodity
              list.
            </p>
          )}

          {facility && !runsEnabled && (
            <p className={styles.warningBanner}>
              Enter your hauler&apos;s cargo capacity above to enable the +1 Run /
              −1 Run buttons.
            </p>
          )}

          {facility && (
            <div className={styles.rows}>
              {requirements.map((req) => {
                const target = targetFor(req.tonnage);
                const collected = state.progress[req.commodity] ?? 0;
                const pct = target > 0 ? Math.min(100, (collected / target) * 100) : 0;
                const checked = target > 0 && collected >= target;

                return (
                  <div key={req.commodity} className={styles.row}>
                    <div className={styles.rowHead}>
                      <span className={styles.commodityName}>{req.commodity}</span>
                      <span className={styles.rowTarget}>
                        {fmt(collected)}T / {fmt(target)}T
                      </span>
                    </div>

                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className={styles.rowPct}>{pct.toFixed(0)}%</div>

                    <div className={styles.rowControls}>
                      <button
                        type="button"
                        className={styles.runBtn}
                        disabled={!runsEnabled || collected <= 0}
                        onClick={() => addRun(req.commodity, -1)}
                        title={
                          !runsEnabled
                            ? "Enter your hauler's cargo capacity above first"
                            : undefined
                        }
                      >
                        −1 Run{runsEnabled ? ` (−${fmt(shipCapacityNum)}T)` : ""}
                      </button>
                      <button
                        type="button"
                        className={styles.runBtn}
                        disabled={!runsEnabled}
                        onClick={() => addRun(req.commodity, 1)}
                        title={
                          !runsEnabled
                            ? "Enter your hauler's cargo capacity above first"
                            : undefined
                        }
                      >
                        +1 Run{runsEnabled ? ` (+${fmt(shipCapacityNum)}T)` : ""}
                      </button>

                      <label className={styles.manualEntry}>
                        <span>Manual</span>
                        <input
                          type="number"
                          min={0}
                          inputMode="numeric"
                          value={collected}
                          onChange={(e) =>
                            setCollected(req.commodity, parseNonNegative(e.target.value))
                          }
                          className={styles.numberInputSmall}
                        />
                        <span>T</span>
                      </label>

                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            toggleCheckbox(req.commodity, target, e.target.checked)
                          }
                        />
                        Complete
                      </label>

                      <button
                        type="button"
                        className={styles.resetBtn}
                        disabled={collected <= 0}
                        onClick={() => resetRow(req.commodity)}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <div className={styles.backLink}>
        <Link href="/">← Back to Portfolio</Link>
      </div>
    </div>
  );
}
