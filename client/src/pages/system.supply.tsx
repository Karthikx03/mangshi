import { useCallback, useRef, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { systemQueryOptions } from "@/lib/systemQuery";
import { usePageMeta } from "@/lib/usePageMeta";
import { api } from "@/lib/api";
import { VEG_OPTIONS } from "@/lib/matching";

/* ------------------------------------------------------------------ */
/*  Kebab (⋮) dropdown                                                */
/* ------------------------------------------------------------------ */

function KebabMenu({
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
  confirmLabel,
  cancelLabel,
}: {
  onEdit: () => void;
  onDelete: () => void;
  editLabel: string;
  deleteLabel: string;
  confirmLabel: string;
  cancelLabel: string;
}) {
  const [open, setOpen] = useState(false);
  // Two-step delete: the first click swaps the menu to an inline "are you sure"
  // row (in the site's own styling) rather than a native window.confirm() popup,
  // which reads as jarring/off-brand next to the rest of this screen and is also
  // easy for a scripted click-through to blow past without noticing it was there.
  const [confirming, setConfirming] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirming(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setConfirming(false);
        }}
        className="p-1.5 rounded hover:bg-border/60 transition-colors text-clay hover:text-foreground"
        aria-label="Actions"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 min-w-[160px] border border-border bg-background shadow-lg">
          {confirming ? (
            <div className="px-4 py-3">
              <p className="text-xs text-clay">{deleteLabel}?</p>
              <div className="mt-2.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setConfirming(false);
                    onDelete();
                  }}
                  className="flex-1 border border-red-600 text-red-600 px-2 py-1.5 text-xs uppercase tracking-[0.15em] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  {confirmLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="flex-1 border border-border px-2 py-1.5 text-xs uppercase tracking-[0.15em] hover:bg-border/40 transition-colors"
                >
                  {cancelLabel}
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onEdit();
                }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-border/40 transition-colors"
              >
                {editLabel}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                {deleteLabel}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main screen                                                        */
/* ------------------------------------------------------------------ */

export default function SupplyScreen() {
  const { t, lang } = useLang();
  const qc = useQueryClient();
  const { data } = useQuery(systemQueryOptions);
  usePageMeta(
    "產地登錄 Farmer Supply — Mangshi 盲食",
    "Farmers log surplus batches by vegetable and weight; campuses add meal preorders. Live stock for the Mangshi matching system.",
  );

  // Set when an API call fails, so a failed save/delete is never silently swallowed.
  const [error, setError] = useState<string | null>(null);

  const [farmer, setFarmer] = useState("");
  const [veg, setVeg] = useState<string>(VEG_OPTIONS[0].veg_key);
  const [kg, setKg] = useState("");
  const [availableFrom, setAvailableFrom] = useState(() => new Date().toISOString().slice(0, 10));
  const [availableTo, setAvailableTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  const [campus, setCampus] = useState("");
  const [portions, setPortions] = useState("");
  const [orderState, setOrderState] = useState<"idle" | "saving" | "saved">("idle");

  // Edit/delete state for supply rows
  const [editingSupplyId, setEditingSupplyId] = useState<string | null>(null);
  const [editSupplyKg, setEditSupplyKg] = useState("");
  const [editSupplyFarmer, setEditSupplyFarmer] = useState("");
  const [editSupplyFrom, setEditSupplyFrom] = useState("");
  const [editSupplyTo, setEditSupplyTo] = useState("");

  // Edit/delete state for preorder rows
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editOrderCampus, setEditOrderCampus] = useState("");
  const [editOrderPortions, setEditOrderPortions] = useState("");

  const label = (zh: string, en: string) => (lang === "zh" ? zh : en);

  const refresh = useCallback(() => qc.invalidateQueries({ queryKey: ["system-data"] }), [qc]);

  // Runs one API mutation, then refetches the shared system snapshot. Returns false on failure.
  const run = async (action: () => Promise<unknown>) => {
    setError(null);
    try {
      await action();
      await refresh();
      return true;
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : String(e));
      return false;
    }
  };

  const onSupply = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = VEG_OPTIONS.find((o) => o.veg_key === veg)!;
    const n = Number(kg);
    if (!Number.isFinite(n) || n <= 0) return;
    setState("saving");
    const ok = await run(() =>
      api.addSupply({
        farmer_name: farmer,
        veg_key: v.veg_key,
        name_zh: v.name_zh,
        name_en: v.name_en,
        kg: n,
        available_from: availableFrom,
        available_to: availableTo,
      }),
    );
    if (ok) setKg("");
    setState(ok ? "saved" : "idle");
  };

  const onOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(portions);
    if (!Number.isFinite(n) || n <= 0) return;
    setOrderState("saving");
    const ok = await run(() => api.addPreorder({ campus, portions: n }));
    if (ok) setPortions("");
    setOrderState(ok ? "saved" : "idle");
  };

  // Confirmation happens inline in the KebabMenu before onDelete is ever called.
  const handleDeleteSupply = (id: string) => run(() => api.deleteSupply(id));

  const handleEditSupply = (s: {
    id: string;
    farmer_name: string;
    kg: number;
    available_from: string;
    available_to: string;
  }) => {
    setEditingSupplyId(s.id);
    setEditSupplyKg(String(s.kg));
    setEditSupplyFarmer(s.farmer_name);
    setEditSupplyFrom(s.available_from);
    setEditSupplyTo(s.available_to);
  };

  const handleSaveSupply = async () => {
    if (!editingSupplyId) return;
    const n = Number(editSupplyKg);
    if (!Number.isFinite(n) || n <= 0) return;
    const id = editingSupplyId;
    const ok = await run(() =>
      api.updateSupply(id, {
        farmer_name: editSupplyFarmer,
        kg: n,
        available_from: editSupplyFrom,
        available_to: editSupplyTo,
      }),
    );
    if (ok) setEditingSupplyId(null);
  };

  const handleDeletePreorder = (id: string) => run(() => api.deletePreorder(id));

  const handleEditPreorder = (p: { id: string; campus: string; portions: number }) => {
    setEditingOrderId(p.id);
    setEditOrderCampus(p.campus);
    setEditOrderPortions(String(p.portions));
  };

  const handleSavePreorder = async () => {
    if (!editingOrderId) return;
    const n = Number(editOrderPortions);
    if (!Number.isFinite(n) || n <= 0) return;
    const id = editingOrderId;
    const ok = await run(() => api.updatePreorder(id, { campus: editOrderCampus, portions: n }));
    if (ok) setEditingOrderId(null);
  };

  const field =
    "w-full bg-transparent border-b border-input py-2 text-sm focus:outline-none focus:border-foreground transition-colors";
  const btn =
    "mt-6 inline-flex items-center gap-2 border border-foreground px-6 py-3 text-[11px] uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors disabled:opacity-50";
  const inlineField =
    "bg-transparent border-b border-input py-1 text-sm focus:outline-none focus:border-foreground transition-colors";
  const smallBtn = "px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border transition-colors";

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
      <Reveal>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl">{t("sys.supply.title")}</h1>
        <p className="mt-3 text-clay max-w-xl text-sm sm:text-base">{t("sys.supply.body")}</p>
      </Reveal>

      {error && (
        <p
          role="alert"
          className="mt-6 border border-red-300 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-400"
        >
          {t("sys.supply.syncWarning")} <span className="font-mono text-xs">({error})</span>
        </p>
      )}

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <Reveal className="border border-border p-6 sm:p-8">
          <form onSubmit={onSupply}>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                  {t("sys.supply.farmer")}
                </span>
                <input
                  className={field}
                  value={farmer}
                  onChange={(e) => setFarmer(e.target.value)}
                  placeholder={label("陳大哥 / 客庄合作社", "Chen / cooperative")}
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                  {t("sys.supply.veg")}
                </span>
                <select className={field} value={veg} onChange={(e) => setVeg(e.target.value)}>
                  {VEG_OPTIONS.map((o) => (
                    <option key={o.veg_key} value={o.veg_key}>
                      {lang === "zh" ? o.name_zh : o.name_en}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                  {t("sys.supply.kg")}
                </span>
                <input
                  className={field}
                  inputMode="decimal"
                  value={kg}
                  onChange={(e) => setKg(e.target.value)}
                  placeholder="120"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                  {lang === "zh" ? "可取開始日" : "Available from"}
                </span>
                <input
                  type="date"
                  className={field}
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                  {lang === "zh" ? "可取結束日" : "Available until"}
                </span>
                <input
                  type="date"
                  min={availableFrom}
                  className={field}
                  value={availableTo}
                  onChange={(e) => setAvailableTo(e.target.value)}
                />
              </label>
            </div>
            <button className={btn} disabled={state === "saving"}>
              {state === "saving" ? t("sys.supply.saving") : t("sys.supply.submit")}
            </button>
            {state === "saved" && <p className="mt-4 text-sm text-sage">{t("sys.supply.saved")}</p>}
          </form>
        </Reveal>

        <Reveal className="border border-border p-6 sm:p-8" delay={100}>
          <h2 className="font-display text-2xl">{t("sys.order.title")}</h2>
          <form onSubmit={onOrder} className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                  {t("sys.order.campus")}
                </span>
                <input
                  className={field}
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  placeholder={label("中央大學", "NCU")}
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                  {t("sys.order.portions")}
                </span>
                <input
                  className={field}
                  inputMode="numeric"
                  value={portions}
                  onChange={(e) => setPortions(e.target.value)}
                  placeholder="80"
                />
              </label>
            </div>
            <button className={btn} disabled={orderState === "saving"}>
              {orderState === "saving" ? t("sys.supply.saving") : t("sys.order.submit")}
            </button>
            {orderState === "saved" && (
              <p className="mt-4 text-sm text-sage">{t("sys.order.saved")}</p>
            )}
          </form>
        </Reveal>
      </div>

      {/* ---- Supply list ---- */}
      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
            {t("sys.supply.list")}
          </h2>
          <ul className="mt-4 divide-y divide-border border-t border-border">
            {(data?.supply ?? []).map((s) => (
              <li key={s.id} className="py-4">
                {editingSupplyId === s.id ? (
                  /* ---- Inline edit mode ---- */
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className={inlineField}
                        value={editSupplyFarmer}
                        onChange={(e) => setEditSupplyFarmer(e.target.value)}
                        placeholder={t("sys.supply.farmer")}
                      />
                      <input
                        className={inlineField}
                        inputMode="decimal"
                        value={editSupplyKg}
                        onChange={(e) => setEditSupplyKg(e.target.value)}
                        placeholder="kg"
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="date"
                        className={inlineField}
                        value={editSupplyFrom}
                        onChange={(e) => setEditSupplyFrom(e.target.value)}
                      />
                      <input
                        type="date"
                        className={inlineField}
                        value={editSupplyTo}
                        onChange={(e) => setEditSupplyTo(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSaveSupply}
                        className={`${smallBtn} border-foreground hover:bg-foreground hover:text-background`}
                      >
                        {t("sys.supply.save")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSupplyId(null)}
                        className={`${smallBtn} border-border text-clay hover:border-foreground`}
                      >
                        {t("sys.supply.cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ---- Normal display mode ---- */
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-display text-xl">
                        {lang === "zh" ? s.name_zh : s.name_en}
                      </p>
                      <p className="text-xs text-clay mt-1">
                        {s.farmer_name} · {t("sys.supply.window")} {s.available_from} →{" "}
                        {s.available_to}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <p className="font-mono text-sm">{Number(s.kg).toLocaleString()} kg</p>
                      <KebabMenu
                        editLabel={t("sys.supply.edit")}
                        deleteLabel={t("sys.supply.delete")}
                        confirmLabel={t("sys.supply.delete")}
                        cancelLabel={t("sys.supply.cancel")}
                        onEdit={() => handleEditSupply(s)}
                        onDelete={() => handleDeleteSupply(s.id)}
                      />
                    </div>
                  </div>
                )}
              </li>
            ))}
            {(data?.supply ?? []).length === 0 && (
              <li className="py-4 text-sm text-clay">{t("sys.supply.empty")}</li>
            )}
          </ul>
        </div>

        {/* ---- Preorder list ---- */}
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
            {t("sys.order.list")}
          </h2>
          <ul className="mt-4 divide-y divide-border border-t border-border">
            {(data?.preorders ?? []).map((p) => (
              <li key={p.id} className="py-4">
                {editingOrderId === p.id ? (
                  /* ---- Inline edit mode ---- */
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className={inlineField}
                        value={editOrderCampus}
                        onChange={(e) => setEditOrderCampus(e.target.value)}
                        placeholder={t("sys.order.campus")}
                      />
                      <input
                        className={inlineField}
                        inputMode="numeric"
                        value={editOrderPortions}
                        onChange={(e) => setEditOrderPortions(e.target.value)}
                        placeholder={t("sys.order.portions")}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSavePreorder}
                        className={`${smallBtn} border-foreground hover:bg-foreground hover:text-background`}
                      >
                        {t("sys.supply.save")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingOrderId(null)}
                        className={`${smallBtn} border-border text-clay hover:border-foreground`}
                      >
                        {t("sys.supply.cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ---- Normal display mode ---- */
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-xl">{p.campus}</p>
                      <p className="text-xs text-clay mt-1">{p.order_date}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <p className="font-mono text-sm">
                        {p.portions} {t("sys.match.portions")}
                      </p>
                      <KebabMenu
                        editLabel={t("sys.order.edit")}
                        deleteLabel={t("sys.order.delete")}
                        confirmLabel={t("sys.order.delete")}
                        cancelLabel={t("sys.supply.cancel")}
                        onEdit={() => handleEditPreorder(p)}
                        onDelete={() => handleDeletePreorder(p.id)}
                      />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
