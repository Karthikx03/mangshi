import { createServerFn } from "@tanstack/react-start";
import type { Recipe } from "./seasons";
import type { Preorder, SupplyRow } from "./matching";
import type { TablesUpdate } from "@/integrations/supabase/types";

export const getSystemData = createServerFn({ method: "GET" }).handler(async () => {
  const { publicServerClient } = await import("./db.server");
  const supabase = publicServerClient();

  const [supplyRes, orderRes, recipeRes, ingRes] = await Promise.all([
    supabase
      .from("farm_supply")
      .select(
        "id, farmer_name, veg_key, name_zh, name_en, kg, available_from, available_to, status",
      )
      .order("created_at", { ascending: false })
      .limit(60),
    supabase
      .from("preorders")
      .select("id, order_date, campus, portions")
      .order("created_at", { ascending: false })
      .limit(60),
    supabase.from("recipes").select("*").order("code"),
    supabase
      .from("recipe_ingredients")
      .select("recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core"),
  ]);

  if (supplyRes.error) throw supplyRes.error;
  if (orderRes.error) throw orderRes.error;
  if (recipeRes.error) throw recipeRes.error;
  if (ingRes.error) throw ingRes.error;

  const recipes: Recipe[] = (recipeRes.data ?? []).map((r) => ({
    id: r.id,
    code: r.code,
    name_zh: r.name_zh,
    name_en: r.name_en,
    prep_min: r.prep_min,
    cook_min: r.cook_min,
    cost_ntd: Number(r.cost_ntd),
    kcal: r.kcal,
    protein_g: Number(r.protein_g),
    carbs_g: Number(r.carbs_g),
    fat_g: Number(r.fat_g),
    fiber_g: Number(r.fiber_g),
    vegetarian: r.vegetarian,
    allergens: r.allergens ?? [],
    max_batch: r.max_batch,
    note_zh: r.note_zh,
    note_en: r.note_en,
    ingredients: (ingRes.data ?? [])
      .filter((i) => i.recipe_id === r.id)
      .map((i) => ({
        veg_key: i.veg_key,
        name_zh: i.name_zh,
        name_en: i.name_en,
        kg_per_100: Number(i.kg_per_100),
        is_core: i.is_core,
      })),
  }));

  const supply: SupplyRow[] = (supplyRes.data ?? []).map((s) => ({
    ...s,
    kg: Number(s.kg),
  }));
  const preorders: Preorder[] = orderRes.data ?? [];

  return { supply, preorders, recipes };
});

export const addSupply = createServerFn({ method: "POST" })
  .validator(
    (input: {
      farmer_name: string;
      veg_key: string;
      name_zh: string;
      name_en: string;
      kg: number;
      available_from?: string;
      available_to?: string;
    }) => {
      const kg = Number(input.kg);
      if (!input.veg_key || !Number.isFinite(kg) || kg <= 0 || kg > 5000) {
        throw new Error("Invalid supply entry");
      }
      return {
        farmer_name: String(input.farmer_name || "").slice(0, 60) || "示範農友",
        veg_key: String(input.veg_key).slice(0, 40),
        name_zh: String(input.name_zh).slice(0, 40),
        name_en: String(input.name_en).slice(0, 60),
        kg: Math.round(kg * 10) / 10,
        available_from: input.available_from || new Date().toISOString().slice(0, 10),
        available_to: input.available_to || new Date().toISOString().slice(0, 10),
      };
    },
  )
  .handler(async ({ data }) => {
    const { publicServerClient } = await import("./db.server");
    const { error } = await publicServerClient().from("farm_supply").insert(data);
    if (error) throw error;
    return { ok: true };
  });

export const addPreorder = createServerFn({ method: "POST" })
  .validator((input: { campus: string; portions: number }) => {
    const portions = Math.round(Number(input.portions));
    if (!Number.isFinite(portions) || portions <= 0 || portions > 5000) {
      throw new Error("Invalid preorder");
    }
    return { campus: String(input.campus || "").slice(0, 60) || "中央大學", portions };
  })
  .handler(async ({ data }) => {
    const { publicServerClient } = await import("./db.server");
    const { error } = await publicServerClient().from("preorders").insert(data);
    if (error) throw error;
    return { ok: true };
  });

export const deleteSupply = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => {
    if (!input.id) throw new Error("Missing id");
    return { id: String(input.id) };
  })
  .handler(async ({ data }) => {
    const { publicServerClient } = await import("./db.server");
    const { error } = await publicServerClient().from("farm_supply").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const updateSupply = createServerFn({ method: "POST" })
  .validator(
    (input: {
      id: string;
      farmer_name?: string;
      veg_key?: string;
      name_zh?: string;
      name_en?: string;
      kg?: number;
      available_from?: string;
      available_to?: string;
    }) => {
      if (!input.id) throw new Error("Missing id");
      const patch: TablesUpdate<"farm_supply"> = {};
      if (input.farmer_name !== undefined)
        patch.farmer_name = String(input.farmer_name).slice(0, 60);
      if (input.veg_key !== undefined) patch.veg_key = String(input.veg_key).slice(0, 40);
      if (input.name_zh !== undefined) patch.name_zh = String(input.name_zh).slice(0, 40);
      if (input.name_en !== undefined) patch.name_en = String(input.name_en).slice(0, 60);
      if (input.kg !== undefined) {
        const kg = Number(input.kg);
        if (!Number.isFinite(kg) || kg <= 0 || kg > 5000) throw new Error("Invalid kg");
        patch.kg = Math.round(kg * 10) / 10;
      }
      if (input.available_from !== undefined) patch.available_from = input.available_from;
      if (input.available_to !== undefined) patch.available_to = input.available_to;
      return { id: String(input.id), patch };
    },
  )
  .handler(async ({ data }) => {
    const { publicServerClient } = await import("./db.server");
    const { error } = await publicServerClient()
      .from("farm_supply")
      .update(data.patch)
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const deletePreorder = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => {
    if (!input.id) throw new Error("Missing id");
    return { id: String(input.id) };
  })
  .handler(async ({ data }) => {
    const { publicServerClient } = await import("./db.server");
    const { error } = await publicServerClient().from("preorders").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const updatePreorder = createServerFn({ method: "POST" })
  .validator((input: { id: string; campus?: string; portions?: number }) => {
    if (!input.id) throw new Error("Missing id");
    const patch: TablesUpdate<"preorders"> = {};
    if (input.campus !== undefined) patch.campus = String(input.campus).slice(0, 60);
    if (input.portions !== undefined) {
      const portions = Math.round(Number(input.portions));
      if (!Number.isFinite(portions) || portions <= 0 || portions > 5000)
        throw new Error("Invalid portions");
      patch.portions = portions;
    }
    return { id: String(input.id), patch };
  })
  .handler(async ({ data }) => {
    const { publicServerClient } = await import("./db.server");
    const { error } = await publicServerClient()
      .from("preorders")
      .update(data.patch)
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
