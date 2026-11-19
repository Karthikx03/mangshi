import { usePageMeta } from "@/lib/usePageMeta";
import { Link } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/translations";
import missionFarm from "@/assets/mission-farm.jpg";
import ingredients from "@/assets/ingredients.jpg";
import { CountUp } from "@/components/Reveal";

const stats: Array<{ value: number; prefix?: string; suffix?: string; labelKey: TranslationKey; bodyKey: TranslationKey }> = [
  { value: 94, suffix: "%", labelKey: "mission.stat1.label", bodyKey: "mission.stat1.body" },
  { value: 10, prefix: "NT$", labelKey: "mission.stat2.label", bodyKey: "mission.stat2.body" },
  { value: 330, suffix: "k T", labelKey: "mission.stat3.label", bodyKey: "mission.stat3.body" },
  { value: 1600, labelKey: "mission.stat4.label", bodyKey: "mission.stat4.body" },
];

const loop: Array<{ titleKey: TranslationKey; bodyKey: TranslationKey }> = [
  { titleKey: "mission.loop1.title", bodyKey: "mission.loop1.body" },
  { titleKey: "mission.loop2.title", bodyKey: "mission.loop2.body" },
  { titleKey: "mission.loop3.title", bodyKey: "mission.loop3.body" },
  { titleKey: "mission.loop4.title", bodyKey: "mission.loop4.body" },
];

export default function Mission() {
  usePageMeta("Mission — Hakka Blind Box", "Why we exist: 94% of Taiwan's vegetables stay domestic, fields are tilled back under, and students still can't afford a balanced meal.");
  const { t } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* HEADER */}
      <section className="pt-40 pb-20 px-6 md:px-8 max-w-5xl mx-auto">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
          {t("mission.kicker")}
        </span>
        <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] text-balance">
          {t("mission.title1")} <br />
          {t("mission.title2")} <span className="italic">{t("mission.title.cant")}</span>{" "}
          {t("mission.title3")}
        </h1>
        <p className="mt-8 max-w-2xl text-clay leading-relaxed text-lg">
          {t("mission.body")}
        </p>
      </section>

      {/* FULL-BLEED FARM */}
      <section className="px-6 md:px-8">
        <img
          src={missionFarm}
          alt="Misty terraced farm in Miaoli highlands"
          loading="lazy"
          width={1600}
          height={1000}
          className="w-full aspect-[16/8] object-cover"
        />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-clay/70">
          {t("mission.caption")}
        </p>
      </section>

      {/* DATA */}
      <section className="py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
            {t("mission.numbers.kicker")}
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            {t("mission.numbers.title")}
          </h2>

          <div className="mt-16 grid md:grid-cols-2 gap-x-16 gap-y-20">
            {stats.map((s) => (
              <article key={s.labelKey} className="border-t border-foreground/10 pt-8">
                <p className="font-display italic text-7xl md:text-8xl text-indigo-dye leading-none">
                  {s.prefix}<CountUp to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
                  {t(s.labelKey)}
                </p>
                <p className="mt-4 text-foreground/80 leading-relaxed max-w-md">
                  {t(s.bodyKey)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PROBLEMS, ONE ANSWER */}
      <section className="bg-indigo-dye text-paper py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
            {t("mission.three.kicker")}
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight">
            {t("mission.three.title1")} <br />
            <span className="italic">{t("mission.three.title2")}</span>
          </h2>
          <p className="mt-8 max-w-2xl leading-relaxed opacity-80">
            {t("mission.three.body")}
          </p>
        </div>
      </section>

      {/* MODEL */}
      <section className="py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6">
            <img
              src={ingredients}
              alt="Rescued surplus vegetables"
              loading="lazy"
              width={1400}
              height={1000}
              className="w-full aspect-square object-cover"
            />
          </div>
          <div className="md:col-span-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
              {t("mission.loop.kicker")}
            </span>
            <h3 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
              {t("mission.loop.title")}
            </h3>
            <ol className="mt-8 space-y-6">
              {loop.map((step, i) => (
                <li key={step.titleKey} className="flex gap-6">
                  <span className="font-display italic text-3xl text-indigo-dye/60 w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="font-display text-2xl">{t(step.titleKey)}</h4>
                    <p className="mt-2 text-clay leading-relaxed">{t(step.bodyKey)}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              to="/join"
              className="mt-10 inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-indigo-dye group"
            >
              <span>{t("mission.cta")}</span>
              <span className="block w-8 h-px bg-indigo-dye transition-all duration-500 group-hover:w-12" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
