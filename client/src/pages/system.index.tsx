import { usePageMeta } from "@/lib/usePageMeta";
import { Link } from "react-router-dom";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import farm from "@/assets/mission-farm.jpg";

export default function SystemOverview() {
  usePageMeta("系統 System — Mangshi 盲食 Dynamic Menu Matching", "How Mangshi turns logged farm surplus and campus preorders into scaled Hakka menus — a deterministic matching system, not guesswork.");
  const { t } = useLang();
  const steps = ["sys.step1", "sys.step2", "sys.step3", "sys.step4"] as const;

  return (
    <main>
      <section className="relative">
        <div className="relative h-[46vh] min-h-[18rem] overflow-hidden">
          <img
            src={farm}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          <div className="relative h-full max-w-4xl mx-auto px-6 flex flex-col justify-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
              {t("sys.kicker")}
            </p>
            <h1 className="mt-4 font-display text-[2.25rem] sm:text-5xl md:text-6xl leading-[1.1] text-foreground">
              {t("sys.title")}
            </h1>
            <p className="mt-3 font-display italic text-xl sm:text-2xl text-clay">
              {t("sys.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-14 sm:py-20">
        <Reveal>
          <p className="text-base sm:text-lg leading-relaxed text-clay max-w-2xl">
            {t("sys.intro")}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4 border border-border">
          {steps.map((k, i) => (
            <Reveal key={k} delay={i * 90}>
              <div className="bg-background p-6 h-full">
                <span className="font-mono text-[10px] text-clay">0{i + 1}</span>
                <p className="mt-3 font-display text-xl sm:text-2xl leading-snug">{t(k)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12">
          <Link
            to="/system/supply"
            className="inline-flex items-center gap-3 border border-foreground px-6 py-3 text-[11px] uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors"
          >
            {t("sys.enter")} →
          </Link>
        </div>
      </section>
    </main>
  );
}
