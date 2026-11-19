import { usePageMeta } from "@/lib/usePageMeta";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/translations";
import cultureHands from "@/assets/culture-hands.jpg";
import ingredients from "@/assets/ingredients.jpg";
import picklingJars from "@/assets/pickling-jars.png";

const stories: Array<{ no: string; titleKey: TranslationKey; bodyKey: TranslationKey }> = [
  { no: "01", titleKey: "culture.story1.title", bodyKey: "culture.story1.body" },
  { no: "02", titleKey: "culture.story2.title", bodyKey: "culture.story2.body" },
  { no: "03", titleKey: "culture.story3.title", bodyKey: "culture.story3.body" },
  { no: "04", titleKey: "culture.story4.title", bodyKey: "culture.story4.body" },
];

export default function Culture() {
  usePageMeta("Hakka Culture — Hakka Blind Box", "Hakka heritage in Taiwan: pickling, preservation, indigo textiles, and the philosophy of wasting nothing.");
  const { t } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* OPENING */}
      <section className="pt-40 pb-20 px-6 md:px-8 max-w-5xl mx-auto">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
          {t("culture.kicker")}
        </span>
        <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] text-balance">
          {t("culture.title1")} <span className="italic">{t("culture.title.scarcity")}</span>{" "}
          {t("culture.title2")} <span className="italic">{t("culture.title.generosity")}</span>
        </h1>
        <p className="mt-8 max-w-2xl text-clay leading-relaxed text-lg">
          {t("culture.body")}
        </p>
      </section>

      {/* FULL-BLEED IMAGE */}
      <section className="px-6 md:px-8">
        <img
          src={picklingJars}
          alt="Traditional Hakka pickling jars in a warm kitchen"
          loading="lazy"
          width={1024}
          height={1536}
          className="w-full aspect-[16/7] object-cover object-[center_58%]"
        />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-clay/70">
          {t("culture.caption")}
        </p>
      </section>

      {/* STORIES GRID */}
      <section className="py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
            {t("culture.notes.kicker")}
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            {t("culture.notes.title")}
          </h2>

          <div className="mt-16 grid md:grid-cols-2 gap-x-12 gap-y-16">
            {stories.map((s) => (
              <article key={s.no} className="border-t border-foreground/10 pt-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
                  {s.no}
                </span>
                <h3 className="mt-3 font-display text-3xl leading-tight">
                  {t(s.titleKey)}
                </h3>
                <p className="mt-4 text-clay leading-relaxed">{t(s.bodyKey)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PORTRAIT + QUOTE */}
      <section className="px-6 md:px-8 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6">
            <img
              src={cultureHands}
              alt="An elderly weaver's hands at an indigo loom"
              loading="lazy"
              width={1080}
              height={1620}
              className="w-full aspect-[3/4] object-cover"
            />
          </div>
          <div className="md:col-span-6">
            <blockquote className="font-display text-3xl md:text-5xl italic leading-tight text-balance">
              &ldquo;{t("culture.quote")}&rdquo;
            </blockquote>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
              {t("culture.quote.attr")}
            </p>
          </div>
        </div>
      </section>

      {/* CLOSING IMAGE */}
      <section className="px-6 md:px-8 pb-32">
        <div className="max-w-7xl mx-auto">
          <img
            src={ingredients}
            alt="Surplus broccoli, mustard greens, daikon and ginger on linen"
            loading="lazy"
            width={1400}
            height={1000}
            className="w-full aspect-[16/10] object-cover"
          />
          <div className="mt-10 max-w-2xl">
            <p className="font-display text-2xl md:text-3xl leading-snug text-balance">
              {t("culture.closing")}{" "}
              <span className="italic">{t("culture.closing.surplus")}</span>{" "}
              {t("culture.closing2")}{" "}
              <span className="italic">{t("culture.closing.dinner")}</span>
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
