import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { systemQueryOptions } from "@/lib/systemQuery";

export const Route = createFileRoute("/system/recipes")({
  head: () => ({
    meta: [
      { title: "媽媽食譜庫 Recipe Library — Mangshi 盲食" },
      {
        name: "description",
        content:
          "The standardized Hakka recipe library the Mangshi matching system scales from — every recipe the matcher is allowed to select and nothing else.",
      },
      { property: "og:title", content: "媽媽食譜庫 Recipe Library — Mangshi 盲食" },
      {
        property: "og:description",
        content:
          "Every validated recipe the matcher can select — quantities, cost, prep and nutrition per 100 servings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RecipeLibraryScreen,
});

function RecipeLibraryScreen() {
  const { t, lang } = useLang();
  const { data } = useQuery(systemQueryOptions);
  const recipes = data?.recipes ?? [];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
      <Reveal>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl">{t("sys.recipes.title")}</h1>
        <p className="mt-3 text-clay max-w-xl text-sm sm:text-base">{t("sys.recipes.body")}</p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
          {recipes.length} {t("sys.recipes.count")}
        </p>
      </Reveal>

      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe, i) => (
          <Reveal key={recipe.id} delay={i * 40} className="border border-border p-6 flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
              {recipe.code}
            </span>
            <h2 className="mt-2 font-display text-2xl">
              {lang === "zh" ? recipe.name_zh : recipe.name_en}
            </h2>
            {(lang === "zh" ? recipe.note_zh : recipe.note_en) && (
              <p className="mt-2 text-sm text-clay">
                {lang === "zh" ? recipe.note_zh : recipe.note_en}
              </p>
            )}

            <ul className="mt-5 space-y-1.5 text-sm">
              {recipe.ingredients.map((ing) => (
                <li key={ing.veg_key} className="flex justify-between gap-4 text-clay">
                  <span>
                    {lang === "zh" ? ing.name_zh : ing.name_en}
                    {ing.is_core && (
                      <span className="ml-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-sage">
                        core
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-xs shrink-0">
                    {Math.round(ing.kg_per_100 * 10) / 10} kg / 100
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid grid-cols-5 gap-1 text-center border-t border-border pt-4">
              {[
                [recipe.kcal, t("box.kcal")],
                [`${recipe.protein_g}g`, t("box.protein")],
                [`${recipe.carbs_g}g`, t("box.carbs")],
                [`${recipe.fat_g}g`, t("box.fat")],
                [`${recipe.fiber_g}g`, t("seasons.fiber")],
              ].map(([v, l]) => (
                <div key={String(l)}>
                  <p className="font-display text-lg">{v}</p>
                  <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-clay">{l}</p>
                </div>
              ))}
            </div>

            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
              {t("sys.kitchen.prep")} {recipe.prep_min}
              {t("sys.kitchen.min")} · {t("sys.kitchen.cook")} {recipe.cook_min}
              {t("sys.kitchen.min")} · {t("sys.recipes.batch")} {recipe.max_batch}
            </p>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
              {t("sys.recipes.cost")} NT${recipe.cost_ntd} ·{" "}
              {recipe.vegetarian ? t("seasons.veg") : t("seasons.nonveg")}
              {recipe.allergens.length
                ? ` · ${t("seasons.allergens")}: ${recipe.allergens.join(", ")}`
                : ""}
            </p>
          </Reveal>
        ))}
        {recipes.length === 0 && <p className="text-sm text-clay">{t("sys.match.none")}</p>}
      </div>
    </main>
  );
}
