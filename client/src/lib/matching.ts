// Deterministic menu matching. No AI: it only selects and scales stored recipes.
import type { Recipe } from "./seasons";

export type SupplyRow = {
  id: string;
  farmer_name: string;
  veg_key: string;
  name_zh: string;
  name_en: string;
  kg: number;
  available_from: string;
  available_to: string;
  status: string;
};

export type Preorder = {
  id: string;
  order_date: string;
  campus: string;
  portions: number;
};

export type MatchIngredient = {
  veg_key: string;
  name_zh: string;
  name_en: string;
  kg: number;
  g_per_portion: number;
  fromSurplus: boolean;
};

export type MatchItem = {
  recipe: Recipe;
  portions: number;
  kgUsed: number;
  ingredients: MatchIngredient[];
};

export type MatchResult = {
  items: MatchItem[];
  kgAvailable: number;
  kgUsed: number;
  kgRemaining: number;
  utilization: number; // %
  meals: number;
  mealsOrdered: number;
  coverage: number; // % of orders covered
};

/** One dish may not claim more than this share of a single vegetable batch. */
const MAX_SHARE_PER_RECIPE = 0.5;
const BATCH_STEP = 10;

export function matchMenus(
  supply: SupplyRow[],
  preorders: Preorder[],
  recipes: Recipe[],
  maxDishes = 4,
): MatchResult {
  const stock = new Map<string, number>();
  for (const s of supply) {
    stock.set(s.veg_key, (stock.get(s.veg_key) ?? 0) + Number(s.kg));
  }
  const initial = new Map(stock);
  const kgAvailable = [...initial.values()].reduce((a, b) => a + b, 0);
  const mealsOrdered = preorders.reduce((a, p) => a + Number(p.portions), 0);
  let mealsLeft = mealsOrdered;

  const score = (r: Recipe) =>
    r.ingredients.reduce((sum, i) => sum + (initial.get(i.veg_key) ?? 0) * Number(i.kg_per_100), 0);

  const candidates = recipes
    .filter((r) => r.ingredients.some((i) => i.is_core && initial.has(i.veg_key)))
    .sort((a, b) => score(b) - score(a));

  const items: MatchItem[] = [];

  for (const recipe of candidates) {
    if (items.length >= maxDishes || mealsLeft <= 0) break;

    let portions: number = Math.min(recipe.max_batch, mealsLeft);
    for (const ing of recipe.ingredients) {
      const perPortion = Number(ing.kg_per_100) / 100;
      const available = stock.get(ing.veg_key);
      if (available === undefined) {
        if (ing.is_core) {
          portions = 0;
          break;
        }
        continue; // support ingredient bought normally
      }
      const cap = (initial.get(ing.veg_key) ?? 0) * MAX_SHARE_PER_RECIPE;
      portions = Math.min(portions, Math.floor(Math.min(available, cap) / perPortion));
    }

    portions = Math.floor(portions / BATCH_STEP) * BATCH_STEP;
    if (portions <= 0) continue;

    const ingredients: MatchIngredient[] = [];
    let kgUsed = 0;
    for (const ing of recipe.ingredients) {
      const kg = (Number(ing.kg_per_100) / 100) * portions;
      const fromSurplus = stock.has(ing.veg_key);
      if (fromSurplus) {
        stock.set(ing.veg_key, Math.max(0, (stock.get(ing.veg_key) ?? 0) - kg));
        kgUsed += kg;
      }
      ingredients.push({
        veg_key: ing.veg_key,
        name_zh: ing.name_zh,
        name_en: ing.name_en,
        kg: Math.round(kg * 10) / 10,
        g_per_portion: Math.round(Number(ing.kg_per_100) * 10),
        fromSurplus,
      });
    }

    mealsLeft -= portions;
    items.push({ recipe, portions, kgUsed: Math.round(kgUsed * 10) / 10, ingredients });
  }

  const kgUsed = items.reduce((a, b) => a + b.kgUsed, 0);
  const meals = items.reduce((a, b) => a + b.portions, 0);

  return {
    items,
    kgAvailable: Math.round(kgAvailable),
    kgUsed: Math.round(kgUsed),
    kgRemaining: Math.max(0, Math.round(kgAvailable - kgUsed)),
    utilization: kgAvailable ? Math.round((kgUsed / kgAvailable) * 1000) / 10 : 0,
    meals,
    mealsOrdered,
    coverage: mealsOrdered ? Math.round((meals / mealsOrdered) * 1000) / 10 : 0,
  };
}

export const VEG_OPTIONS = [
  { veg_key: "broccoli", name_zh: "青花菜", name_en: "Broccoli" },
  { veg_key: "mustard_greens", name_zh: "芥菜", name_en: "Mustard Greens" },
  { veg_key: "cabbage", name_zh: "高麗菜", name_en: "Cabbage" },
  { veg_key: "daikon", name_zh: "白蘿蔔", name_en: "Daikon" },
  { veg_key: "carrot", name_zh: "紅蘿蔔", name_en: "Carrot" },
  { veg_key: "tomato", name_zh: "番茄", name_en: "Tomato" },
  { veg_key: "sweet_potato_leaf", name_zh: "地瓜葉", name_en: "Sweet Potato Leaf" },
  { veg_key: "eggplant", name_zh: "茄子", name_en: "Eggplant" },
] as const;
