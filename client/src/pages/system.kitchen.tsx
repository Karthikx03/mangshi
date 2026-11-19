import { usePageMeta } from "@/lib/usePageMeta";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { systemQueryOptions } from "@/lib/systemQuery";
import { matchMenus } from "@/lib/matching";

// "Done" is tracked per calendar day so yesterday's checkmarks don't linger.
// It lives in this browser's localStorage — there is no cross-device kitchen
// plan table yet (see production_plans/plan_items in the schema, currently
// unused) — so a shared kitchen device keeps state across reloads, but two
// different devices marking the same batch will not see each other's ticks.
function todayKey() {
  return `mangshi_kitchen_done_${new Date().toISOString().slice(0, 10)}`;
}

function loadDone(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(todayKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function KitchenScreen() {
  usePageMeta("廚房計畫 Kitchen Plan — Mangshi 盲食", "Tomorrow's Hakka blind-box production plan: dish batches, scaled pull lists, prep and cook times for the student kitchen.");
  const { t, lang } = useLang();
  const { data } = useQuery(systemQueryOptions);
  const [done, setDone] = useState<Record<string, boolean>>({});

  // Load once on mount (client-only — matches nothing on the server, so this
  // runs after hydration rather than during SSR).
  useEffect(() => {
    setDone(loadDone());
  }, []);

  const plan = useMemo(
    () => (data ? matchMenus(data.supply, data.preorders, data.recipes) : null),
    [data],
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
      <Reveal>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl">{t("sys.kitchen.title")}</h1>
        <p className="mt-3 text-clay max-w-xl text-sm sm:text-base">{t("sys.kitchen.body")}</p>
        <p className="mt-8 font-display text-5xl sm:text-6xl">
          {plan?.meals ?? 0}
          <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.2em] text-clay align-middle">
            {t("sys.kitchen.total")}
          </span>
        </p>
      </Reveal>

      <div className="mt-12 space-y-px bg-border border border-border">
        {(plan?.items ?? []).map((item, i) => {
          const isDone = !!done[item.recipe.id];
          return (
            <Reveal key={item.recipe.id} delay={i * 70}>
              <div className="bg-background p-6 sm:p-8 grid gap-6 md:grid-cols-[1fr_1.2fr] md:gap-10">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                    {item.recipe.code}
                  </p>
                  <h2
                    className={`mt-2 font-display text-3xl sm:text-4xl ${isDone ? "line-through text-clay" : ""}`}
                  >
                    {lang === "zh" ? item.recipe.name_zh : item.recipe.name_en}
                  </h2>
                  <p className="mt-2 font-display text-2xl text-sage">
                    × {item.portions} {t("sys.match.portions")}
                  </p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
                    {t("sys.kitchen.prep")} {item.recipe.prep_min}
                    {t("sys.kitchen.min")} · {t("sys.kitchen.cook")} {item.recipe.cook_min}
                    {t("sys.kitchen.min")}
                  </p>
                  {(lang === "zh" ? item.recipe.note_zh : item.recipe.note_en) && (
                    <p className="mt-4 text-sm text-clay max-w-sm">
                      {lang === "zh" ? item.recipe.note_zh : item.recipe.note_en}
                    </p>
                  )}
                  <button
                    onClick={() =>
                      setDone((d) => {
                        const next = { ...d, [item.recipe.id]: !d[item.recipe.id] };
                        try {
                          localStorage.setItem(todayKey(), JSON.stringify(next));
                        } catch {
                          // best-effort only
                        }
                        return next;
                      })
                    }
                    className={`mt-6 border px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] transition-colors ${
                      isDone
                        ? "border-sage text-sage"
                        : "border-foreground hover:bg-foreground hover:text-background"
                    }`}
                  >
                    {isDone ? t("sys.kitchen.doneOk") : t("sys.kitchen.done")}
                  </button>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
                    {t("sys.kitchen.pull")}
                  </p>
                  <ul className="mt-4 divide-y divide-border border-t border-border">
                    {item.ingredients.map((ing) => (
                      <li key={ing.veg_key} className="py-3 flex justify-between gap-4 text-sm">
                        <span>{lang === "zh" ? ing.name_zh : ing.name_en}</span>
                        <span className="font-mono text-xs text-clay shrink-0">
                          {ing.kg} kg · {ing.g_per_portion} {t("sys.match.perportion")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {plan && plan.items.length === 0 && (
        <p className="mt-8 text-sm text-clay">{t("sys.match.none")}</p>
      )}
    </main>
  );
}
