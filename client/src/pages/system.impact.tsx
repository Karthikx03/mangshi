import { usePageMeta } from "@/lib/usePageMeta";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CountUp, Reveal } from "@/components/Reveal";
import { useLang } from "@/lib/i18n";
import { matchMenus } from "@/lib/matching";
import { systemQueryOptions } from "@/lib/systemQuery";
import harvestCrates from "@/assets/harvest-crates.png";

export default function ImpactScreen() {
  usePageMeta("影響力儀表板 — Mangshi 盲食", "由即時供應、訂單與配對結果計算的食物救援影響力。");
  const { lang, t } = useLang();
  const { data } = useQuery(systemQueryOptions);
  const result = useMemo(
    () => (data ? matchMenus(data.supply, data.preorders, data.recipes) : null),
    [data],
  );
  const farmers = new Set(data?.supply.map((item) => item.farmer_name)).size;
  const stats = [
    { key: "available", label: t("sys.impact.kgAvail"), value: result?.kgAvailable ?? 0, suffix: " kg" },
    { key: "used", label: t("sys.impact.kgUsed"), value: result?.kgUsed ?? 0, suffix: " kg" },
    { key: "meals", label: t("sys.impact.meals"), value: result?.meals ?? 0, suffix: "" },
    { key: "orders", label: t("sys.impact.orders"), value: result?.mealsOrdered ?? 0, suffix: "" },
    { key: "farmers", label: t("sys.impact.farmers"), value: farmers, suffix: "" },
    { key: "revenue", label: t("sys.impact.revenue"), value: (result?.kgUsed ?? 0) * 18, suffix: "", prefix: "NT$" },
    { key: "co2", label: t("sys.impact.co2"), value: (result?.kgUsed ?? 0) * 2, suffix: " kg" },
  ];

  return (
    <main className="pb-16">
      <section className="relative min-h-[22rem] overflow-hidden px-4 sm:px-6 md:px-8">
        <img src={harvestCrates} alt="Fresh vegetables in harvest crates" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/65" />
        <Reveal className="relative mx-auto flex min-h-[22rem] max-w-6xl flex-col justify-end py-12 text-paper">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/70">Mangshi / impact</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl">{t("sys.impact.title")}</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper/80">{t("sys.impact.note")}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 md:px-8">
        <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Reveal key={stat.key} delay={index * 55}>
              <article className="min-h-44 bg-background p-6 sm:p-8">
                <p className="font-display text-4xl sm:text-5xl text-foreground">
                  {stat.prefix}
                  <CountUp to={stat.value} decimals={stat.key === "co2" ? 1 : 0} suffix={stat.suffix} />
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">{stat.label}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={280} className="mt-10 border-l-2 border-sage pl-5 text-sm leading-relaxed text-clay">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
            {lang === "zh" ? "本週摘要" : "This week"}
          </span>
          <p className="mt-2">
            {lang === "zh"
              ? `已規劃 ${result?.meals ?? 0} 份餐盒，剩餘 ${result?.kgRemaining ?? 0} 公斤食材等待下一次配對。`
              : `${result?.meals ?? 0} meals are planned; ${result?.kgRemaining ?? 0} kg remains for the next run.`}
          </p>
        </Reveal>
      </section>
    </main>
  );
}
