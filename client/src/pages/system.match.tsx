import { usePageMeta } from "@/lib/usePageMeta";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/lib/i18n";
import { Reveal, CountUp } from "@/components/Reveal";
import { systemQueryOptions } from "@/lib/systemQuery";
import { matchMenus } from "@/lib/matching";

export default function MatchScreen() {
  usePageMeta("菜單配對 Menu Matching — Mangshi 盲食", "A deterministic allocator scales validated Hakka recipes to the surplus available and the meals ordered — utilization, portions and pull weights in one run.");
  const { t, lang } = useLang();
  const { data } = useQuery(systemQueryOptions);
  const [ran, setRan] = useState(false);

  const result = useMemo(
    () =>
      data ? matchMenus(data.supply, data.preorders, data.recipes) : null,
    [data],
  );

  const stats = result
    ? [
        { label: t("sys.match.available"), value: result.kgAvailable, suffix: " kg" },
        { label: t("sys.match.used"), value: result.kgUsed, suffix: " kg" },
        { label: t("sys.match.utilization"), value: result.utilization, suffix: "%", d: 1 },
        { label: t("sys.match.meals"), value: result.meals, suffix: "" },
        { label: t("sys.match.ordered"), value: result.mealsOrdered, suffix: "" },
        { label: t("sys.match.coverage"), value: result.coverage, suffix: "%", d: 1 },
      ]
    : [];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
      <Reveal>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl">{t("sys.match.title")}</h1>
        <p className="mt-3 text-clay max-w-xl text-sm sm:text-base">{t("sys.match.body")}</p>
        <button
          onClick={() => setRan(true)}
          className="mt-8 inline-flex items-center gap-3 bg-foreground text-background px-7 py-3.5 text-[11px] uppercase tracking-[0.25em] hover:bg-foreground/85 transition-colors"
        >
          {ran ? t("sys.match.again") : t("sys.match.run")}
        </button>
      </Reveal>

      {ran && result && (
        <>
          <div className="mt-14 grid gap-px bg-border border border-border grid-cols-2 lg:grid-cols-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-background p-5">
                <p className="font-display text-3xl sm:text-4xl">
                  <CountUp to={s.value} decimals={s.d ?? 0} suffix={s.suffix} />
                </p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-clay">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <h2 className="mt-16 font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
            {t("sys.match.menus")}
          </h2>

          {result.items.length === 0 && (
            <p className="mt-6 text-sm text-clay">{t("sys.match.none")}</p>
          )}

          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {result.items.map((item, i) => (
              <Reveal key={item.recipe.id} delay={i * 80} className="border border-border p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl sm:text-3xl">
                    {lang === "zh" ? item.recipe.name_zh : item.recipe.name_en}
                  </h3>
                  <p className="font-mono text-sm shrink-0">
                    {item.portions} {t("sys.match.portions")}
                  </p>
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                  {item.recipe.code} · {item.kgUsed} kg {t("sys.match.used")}
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  {item.ingredients.map((ing) => (
                    <li key={ing.veg_key} className="flex justify-between gap-4 border-b border-border pb-2">
                      <span>
                        {lang === "zh" ? ing.name_zh : ing.name_en}
                        <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.15em] text-clay">
                          {ing.fromSurplus ? t("sys.match.surplus") : t("sys.match.market")}
                        </span>
                      </span>
                      <span className="font-mono text-xs text-clay shrink-0">
                        {ing.g_per_portion} {t("sys.match.perportion")} · {ing.kg} kg
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
                  {item.recipe.kcal} kcal · {t("sys.kitchen.prep")} {item.recipe.prep_min}
                  {t("sys.kitchen.min")} · {t("sys.kitchen.cook")} {item.recipe.cook_min}
                  {t("sys.kitchen.min")}
                </p>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
