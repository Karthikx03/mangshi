import { usePageMeta } from "@/lib/usePageMeta";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/translations";

const sample = {
  batch: "#402",
  kcal: 520,
  protein: "26g",
  carbs: "58g",
  fat: "14g",
  ingredientKeys: [
    "box.ing1",
    "box.ing2",
    "box.ing3",
    "box.ing4",
    "box.ing5",
  ] as TranslationKey[],
};

const whys: Array<{ no: string; titleKey: TranslationKey; bodyKey: TranslationKey }> = [
  { no: "i.", titleKey: "box.why1.title", bodyKey: "box.why1.body" },
  { no: "ii.", titleKey: "box.why2.title", bodyKey: "box.why2.body" },
  { no: "iii.", titleKey: "box.why3.title", bodyKey: "box.why3.body" },
];

export default function BoxPage() {
  usePageMeta("The Blind Box — Hakka Blind Box", "Every box shows only ingredients and nutrition — no dish photo, no name. Open one and see the philosophy behind the seal.");
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* HEADER */}
      <section className="pt-40 pb-16 px-6 md:px-8 max-w-5xl mx-auto text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
          {t("box.kicker")}
        </span>
        <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] text-balance">
          {t("box.title1")} <br />
          {t("box.title2")} <span className="italic">{t("box.title.see")}</span>
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-clay leading-relaxed text-lg">
          {t("box.body")}
        </p>
      </section>

      {/* INTERACTIVE BOX */}
      <section className="px-6 md:px-8 pb-24">
        <div className="max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-pressed={open}
            aria-label={open ? t("box.aria.hide") : t("box.aria.reveal")}
            className="relative w-full h-[34rem] sm:h-auto sm:aspect-square cursor-pointer group [perspective:1500px] focus:outline-none"
          >
            <div
              className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
              style={{
                transform: open ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* SEALED FACE */}
              <div className="absolute inset-0 bg-indigo-dye text-paper p-6 sm:p-10 flex flex-col items-center justify-center [backface-visibility:hidden]">
                <div className="w-full h-full border border-paper/20 flex flex-col items-center justify-center gap-6 sm:gap-8 py-6">
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] opacity-60">
                    {t("box.sealed")}
                  </span>
                  <div className="w-24 h-24 sm:w-32 sm:h-32 border border-paper/30 rotate-45 flex items-center justify-center shrink-0">
                    <span className="-rotate-45 font-display text-4xl sm:text-5xl italic">
                      H
                    </span>
                  </div>
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] opacity-60">
                    {t("box.tap")}
                  </span>
                </div>
              </div>

              {/* REVEALED FACE */}
              <div className="absolute inset-0 bg-paper text-foreground p-8 md:p-10 flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)] border border-foreground/10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye font-semibold">
                      {t("box.batch")} {sample.batch}
                    </span>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                      {t("box.origin")}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay text-right">
                    {t("box.harvested")}
                    <br />
                    {t("box.harvested.value")}
                  </span>
                </div>

                <ul className="mt-6 flex-1 flex flex-col justify-center font-display text-xl md:text-2xl leading-snug">
                  {sample.ingredientKeys.map((k) => (
                    <li key={k} className="border-b border-foreground/10 py-2">
                      {t(k)}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 pt-4 border-t border-foreground/10 grid grid-cols-4 gap-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.2em] text-clay">
                  <div>
                    <span className="block text-foreground text-base font-display">
                      {sample.kcal}
                    </span>
                    {t("box.kcal")}
                  </div>
                  <div>
                    <span className="block text-foreground text-base font-display">
                      {sample.protein}
                    </span>
                    {t("box.protein")}
                  </div>
                  <div>
                    <span className="block text-foreground text-base font-display">
                      {sample.carbs}
                    </span>
                    {t("box.carbs")}
                  </div>
                  <div>
                    <span className="block text-foreground text-base font-display">
                      {sample.fat}
                    </span>
                    {t("box.fat")}
                  </div>
                </div>
              </div>
            </div>
          </button>

          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
            {open ? t("box.toggle.open") : t("box.toggle.closed")}
          </p>
        </div>
      </section>

      {/* WHY BLIND */}
      <section className="bg-indigo-dye text-paper py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
            {t("box.why.kicker")}
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight">
            {t("box.why.title")}
          </h2>

          <div className="mt-16 grid md:grid-cols-3 gap-12">
            {whys.map((c) => (
              <article key={c.no}>
                <span className="font-display italic text-3xl text-paper/70">
                  {c.no}
                </span>
                <h3 className="mt-3 font-display text-2xl">{t(c.titleKey)}</h3>
                <p className="mt-4 text-paper/80 leading-relaxed">{t(c.bodyKey)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
