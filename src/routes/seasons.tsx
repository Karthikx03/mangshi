import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageSkeleton } from "@/components/PageSkeleton";
import { useLang } from "@/lib/i18n";
import { getSeasonalCalendar } from "@/lib/seasons.functions";
import { MONTH_LABELS, planMonth } from "@/lib/seasons";
import missionFarm from "@/assets/mission-farm.jpg";
import ingredientsImg from "@/assets/ingredients.jpg";

const calendarQuery = queryOptions({
  queryKey: ["seasonal-calendar"],
  queryFn: () => getSeasonalCalendar(),
});

export const Route = createFileRoute("/seasons")({
  loader: ({ context }) => context.queryClient.ensureQueryData(calendarQuery),
  head: () => ({
    meta: [
      { title: "Surplus Calendar — Mangshi 盲食 產季剩食月曆" },
      {
        name: "description",
        content:
          "Month by month, which Taiwanese vegetables are in surplus — and the validated Hakka recipes, quantities and nutrition Mangshi builds from them.",
      },
      { property: "og:title", content: "產季剩食月曆 · Surplus Calendar" },
      {
        property: "og:description",
        content: "十二個月的剩食地圖,與對應的推薦菜單、用量與營養。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <p className="font-display text-2xl">資料暫時無法載入 · Data unavailable</p>
    </div>
  ),
  pendingComponent: () => (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />
      <div className="pt-[4.5rem] flex-1">
        <PageSkeleton tiles={4} />
      </div>
    </div>
  ),
  pendingMs: 200,
  component: SeasonsPage,
});

const severityTone: Record<string, string> = {
  high: "bg-destructive/15 text-destructive",
  medium: "bg-accent/20 text-foreground",
  low: "bg-muted text-clay",
};

function SeasonsPage() {
  const { lang, t } = useLang();
  const { data } = useSuspenseQuery(calendarQuery);
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);

  const monthSurplus = data.surplus.filter((s) => s.month === month);
  const plan = planMonth(monthSurplus, data.recipes);
  const label = MONTH_LABELS[month - 1]!;

  const nz = <T extends { name_zh: string; name_en: string }>(o: T) =>
    lang === "zh" ? o.name_zh : o.name_en;
  const note = (o: { note_zh: string | null; note_en: string | null }) =>
    (lang === "zh" ? o.note_zh : o.note_en) ?? "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* HEADER */}
      <header className="relative pt-40 pb-20 px-6 md:px-8 overflow-hidden">
        <img
          src={missionFarm}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative max-w-5xl mx-auto text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
            {t("seasons.kicker")}
          </span>
          <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-7xl leading-[1.05] text-balance">
            {t("seasons.title1")} <span className="italic">{t("seasons.title2")}</span>
          </h1>
          <p className="mt-8 max-w-xl mx-auto text-clay leading-relaxed">
            {t("seasons.body")}
          </p>
        </div>
      </header>

      {/* MONTH SELECTOR */}
      <section className="px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {MONTH_LABELS.map((m, i) => {
              const value = i + 1;
              const active = value === month;
              return (
                <button
                  key={m.en}
                  type="button"
                  onClick={() => setMonth(value)}
                  aria-pressed={active}
                  className={`px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.15em] border transition-colors duration-300 ${
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-clay hover:text-foreground hover:border-foreground/40"
                  }`}
                >
                  {lang === "zh" ? m.zh : m.en.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SURPLUS + PLAN */}
      <section className="py-20 md:py-24 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
            <h2 className="font-display text-3xl md:text-5xl">
              {lang === "zh" ? label.zh : label.en}{" "}
              <span className="italic text-clay text-2xl md:text-3xl">
                {t("seasons.surplus.heading")}
              </span>
            </h2>
            <div className="flex gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
              <span>
                {t("seasons.kg.available")}
                <br />
                <span className="font-display text-2xl tracking-normal text-foreground normal-case">
                  {plan.kgAvailable.toLocaleString()} kg
                </span>
              </span>
              <span>
                {t("seasons.meals")}
                <br />
                <span className="font-display text-2xl tracking-normal text-foreground normal-case">
                  {plan.meals.toLocaleString()}
                </span>
              </span>
              <span>
                {t("seasons.utilization")}
                <br />
                <span className="font-display text-2xl tracking-normal text-indigo-dye normal-case">
                  {plan.utilization}%
                </span>
              </span>
            </div>
          </div>

          {/* surplus cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {monthSurplus.map((s) => (
              <div key={s.veg_key} className="border border-border p-6 bg-card">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-2xl">{nz(s)}</h3>
                  <span
                    className={`font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1 ${
                      severityTone[s.severity] ?? severityTone["low"]
                    }`}
                  >
                    {t(`seasons.sev.${s.severity}` as "seasons.sev.high")}
                  </span>
                </div>
                <p className="mt-4 font-display text-4xl text-indigo-dye">
                  {Number(s.typical_surplus_kg).toLocaleString()}
                  <span className="text-base text-clay ml-1">kg</span>
                </p>
                <p className="mt-3 text-sm text-clay leading-relaxed">{note(s)}</p>
              </div>
            ))}
          </div>

          {/* recommended menu */}
          <div className="mt-20">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
              {t("seasons.menu.kicker")}
            </span>
            <h3 className="mt-4 font-display text-3xl md:text-4xl">
              {t("seasons.menu.title")}
            </h3>
            <p className="mt-4 max-w-xl text-sm text-clay leading-relaxed">
              {t("seasons.menu.body")}
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {plan.items.map((item, idx) => (
                <article key={item.recipe.id} className="border border-border bg-card p-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
                      {t("seasons.menu.label")} {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                      NT$ {Number(item.recipe.cost_ntd)} / {t("seasons.portion")}
                    </span>
                  </div>
                  <h4 className="mt-3 font-display text-3xl">{nz(item.recipe)}</h4>
                  <p className="mt-2 text-sm text-clay">{note(item.recipe)}</p>

                  <p className="mt-6 font-display text-5xl text-indigo-dye">
                    {item.portions.toLocaleString()}
                    <span className="text-base text-clay ml-2">
                      {t("seasons.portions")}
                    </span>
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                    {item.kgUsed.toLocaleString()} kg {t("seasons.used")}
                  </p>

                  {/* ingredient amounts */}
                  <div className="mt-6 border-t border-border pt-4">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-clay">
                      {t("seasons.ingredients")}
                    </span>
                    <ul className="mt-3 space-y-2">
                      {item.ingredients.map((ing) => (
                        <li
                          key={ing.veg_key}
                          className="flex justify-between gap-4 text-sm border-b border-border/60 pb-2"
                        >
                          <span>{nz(ing)}</span>
                          <span className="font-mono text-[11px] text-clay">
                            {ing.g_per_portion} g · {ing.kg.toLocaleString()} kg
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* nutrition */}
                  <div className="mt-6 border-t border-border pt-4">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-clay">
                      {t("seasons.nutrition")}
                    </span>
                    <div className="mt-3 grid grid-cols-5 gap-2 text-center">
                      {[
                        [item.recipe.kcal, t("box.kcal")],
                        [`${item.recipe.protein_g}g`, t("box.protein")],
                        [`${item.recipe.carbs_g}g`, t("box.carbs")],
                        [`${item.recipe.fat_g}g`, t("box.fat")],
                        [`${item.recipe.fiber_g}g`, t("seasons.fiber")],
                      ].map(([v, l]) => (
                        <div key={String(l)}>
                          <p className="font-display text-xl">{v}</p>
                          <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-clay">
                            {l}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                    {item.recipe.prep_min + item.recipe.cook_min} min ·{" "}
                    {item.recipe.vegetarian ? t("seasons.veg") : t("seasons.nonveg")}
                    {item.recipe.allergens.length
                      ? ` · ${t("seasons.allergens")}: ${item.recipe.allergens.join(", ")}`
                      : ""}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* METHOD NOTE */}
      <section className="px-6 md:px-8 pb-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 items-center border-t border-border pt-16">
          <div className="md:col-span-5 img-hover-zoom">
            <img
              src={ingredientsImg}
              alt="Rescued surplus vegetables laid out on linen"
              loading="lazy"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
          <div className="md:col-span-7">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
              {t("seasons.method.kicker")}
            </span>
            <h3 className="mt-4 font-display text-3xl md:text-4xl leading-tight">
              {t("seasons.method.title")}
            </h3>
            <p className="mt-5 text-clay leading-relaxed max-w-xl">
              {t("seasons.method.body")}
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
