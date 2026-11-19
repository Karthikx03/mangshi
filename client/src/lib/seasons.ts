// Pure, deterministic seasonal surplus → recipe matching.
// No AI: it only selects and scales validated recipes from the library.

export type SurplusRow = {
  month: number;
  veg_key: string;
  name_zh: string;
  name_en: string;
  typical_surplus_kg: number;
  severity: string;
  note_zh: string | null;
  note_en: string | null;
};

export type RecipeIngredient = {
  veg_key: string;
  name_zh: string;
  name_en: string;
  kg_per_100: number;
  is_core: boolean;
};

export type Recipe = {
  id: string;
  code: string;
  name_zh: string;
  name_en: string;
  prep_min: number;
  cook_min: number;
  cost_ntd: number;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  vegetarian: boolean;
  allergens: string[];
  max_batch: number;
  note_zh: string | null;
  note_en: string | null;
  ingredients: RecipeIngredient[];
};

export type PlanIngredient = {
  veg_key: string;
  name_zh: string;
  name_en: string;
  kg: number; // total kg for the planned portions
  g_per_portion: number;
};

export type PlanItem = {
  recipe: Recipe;
  portions: number;
  kgUsed: number;
  ingredients: PlanIngredient[];
};

export type MonthPlan = {
  month: number;
  items: PlanItem[];
  kgAvailable: number;
  kgUsed: number;
  utilization: number; // 0-100
  meals: number;
};

/** Share of a single vegetable's monthly surplus one recipe may claim. */
const MAX_SHARE_PER_RECIPE = 0.45;

export function planMonth(surplus: SurplusRow[], recipes: Recipe[]): MonthPlan {
  const month = surplus[0]?.month ?? 1;
  const stock = new Map<string, number>();
  for (const s of surplus) {
    stock.set(s.veg_key, (stock.get(s.veg_key) ?? 0) + Number(s.typical_surplus_kg));
  }
  const kgAvailable = [...stock.values()].reduce((a, b) => a + b, 0);
  const initial = new Map(stock);

  const surplusScore = (r: Recipe) =>
    r.ingredients.reduce(
      (sum, i) => sum + (initial.get(i.veg_key) ?? 0) * Number(i.kg_per_100),
      0,
    );

  const candidates = recipes
    .filter((r) => r.ingredients.some((i) => i.is_core && initial.has(i.veg_key)))
    .sort((a, b) => surplusScore(b) - surplusScore(a));

  const items: PlanItem[] = [];

  for (const recipe of candidates) {
    // How many portions can we cook from what is left?
    let portions = Infinity;
    for (const ing of recipe.ingredients) {
      const available = stock.get(ing.veg_key);
      const perPortion = Number(ing.kg_per_100) / 100;
      if (available === undefined) {
        // Non-surplus support ingredient (bought normally) — not limiting.
        if (ing.is_core) {
          portions = 0;
          break;
        }
        continue;
      }
      const cap = (initial.get(ing.veg_key) ?? 0) * MAX_SHARE_PER_RECIPE;
      portions = Math.min(portions, Math.floor(Math.min(available, cap) / perPortion));
    }
    if (!Number.isFinite(portions) || portions <= 0) continue;

    // Round down to a clean batch size the kitchen can actually run.
    portions = Math.floor(portions / 10) * 10;
    if (portions <= 0) continue;

    const ingredients: PlanIngredient[] = [];
    let kgUsed = 0;
    for (const ing of recipe.ingredients) {
      const kg = (Number(ing.kg_per_100) / 100) * portions;
      if (stock.has(ing.veg_key)) {
        stock.set(ing.veg_key, Math.max(0, (stock.get(ing.veg_key) ?? 0) - kg));
        kgUsed += kg;
      }
      ingredients.push({
        veg_key: ing.veg_key,
        name_zh: ing.name_zh,
        name_en: ing.name_en,
        kg: Math.round(kg * 10) / 10,
        g_per_portion: Math.round(Number(ing.kg_per_100) * 10),
      });
    }

    items.push({ recipe, portions, kgUsed: Math.round(kgUsed * 10) / 10, ingredients });
    if (items.length >= 4) break;
  }

  const kgUsed = items.reduce((a, b) => a + b.kgUsed, 0);
  const meals = items.reduce((a, b) => a + b.portions, 0);

  return {
    month,
    items,
    kgAvailable: Math.round(kgAvailable),
    kgUsed: Math.round(kgUsed),
    utilization: kgAvailable ? Math.round((kgUsed / kgAvailable) * 1000) / 10 : 0,
    meals,
  };
}

export const MONTH_LABELS: { zh: string; en: string }[] = [
  { zh: "一月", en: "January" },
  { zh: "二月", en: "February" },
  { zh: "三月", en: "March" },
  { zh: "四月", en: "April" },
  { zh: "五月", en: "May" },
  { zh: "六月", en: "June" },
  { zh: "七月", en: "July" },
  { zh: "八月", en: "August" },
  { zh: "九月", en: "September" },
  { zh: "十月", en: "October" },
  { zh: "十一月", en: "November" },
  { zh: "十二月", en: "December" },
];
