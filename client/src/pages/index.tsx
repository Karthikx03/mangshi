import { usePageMeta } from "@/lib/usePageMeta";
import { Link } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";
import heroSteam from "@/assets/hero-steam.jpg";
import cultureHands from "@/assets/culture-hands.jpg";
import boxSealed from "@/assets/box-sealed.jpg";
import missionFarm from "@/assets/mission-farm.jpg";
import sealedBoxHands from "@/assets/sealed-box-hands-v2.png";
import hakkaTable from "@/assets/hakka-table.png";

export default function Home() {
  usePageMeta("Hakka Blind Box — Mama's hand, sealed in a box", "Hakka heritage meals from rescued surplus produce, served sealed so the flavor — not the photo — leads the experience.");
  const { t } = useLang();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="relative min-h-[100svh] w-full overflow-hidden">
        <img
          src={heroSteam}
          alt="Steam rising from a bamboo steamer in a Taiwanese kitchen"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        <div className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center text-center px-6 py-28 animate-reveal">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-paper/70 mb-6 sm:mb-8">
            {t("home.hero.kicker")}
          </span>
          <h1 className="font-display text-[2.5rem] leading-[1.02] sm:text-6xl md:text-8xl text-paper sm:leading-[0.95] text-balance max-w-5xl">
            {t("home.hero.title1")} <br className="hidden md:block" />
            <span className="italic">{t("home.hero.title2")}</span>
          </h1>
          <p className="mt-8 max-w-md text-paper/80 text-base leading-relaxed">
            {t("home.hero.sub")}
          </p>
          <Link
            to="/box"
            className="mt-10 group inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-paper"
          >
            <span>{t("home.hero.cta")}</span>
            <span className="block w-10 h-px bg-paper transition-all duration-500 group-hover:w-16" />
          </Link>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="block w-px h-12 bg-paper/30" />
        </div>
      </section>

      {/* INTRO STRIP */}
      <section className="py-24 md:py-32 px-6 md:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
            {t("home.intro.kicker")}
          </span>
          <h2 className="mt-6 font-display text-4xl md:text-6xl leading-tight text-foreground text-balance">
            {t("home.intro.title1")}
            <span className="italic"> {t("home.intro.title2")}</span>
          </h2>
        </div>
      </section>

      {/* CULTURE TEASER */}
      <section className="px-6 md:px-8 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-end">
          <div className="md:col-span-7 img-hover-zoom">
            <img
              src={cultureHands}
              alt="Elderly Hakka woman weaving indigo textile"
              loading="lazy"
              width={1200}
              height={1500}
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
          <div className="md:col-span-5 pb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
              {t("home.culture.kicker")}
            </span>
            <h3 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
              {t("home.culture.title1")} <span className="italic">{t("home.culture.title2")}</span>
            </h3>
            <p className="mt-6 text-clay leading-relaxed max-w-md">
              {t("home.culture.body")}
            </p>
            <Link
              to="/culture"
              className="mt-8 inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-indigo-dye group"
            >
              <span>{t("home.culture.cta")}</span>
              <span className="block w-8 h-px bg-indigo-dye transition-all duration-500 group-hover:w-12" />
            </Link>
          </div>
        </div>
      </section>

      {/* BOX TEASER */}
      <section className="bg-indigo-dye text-paper py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5 md:order-2 img-hover-zoom">
            <img
              src={boxSealed}
              alt="A sealed kraft meal box with an indigo paper band"
              loading="lazy"
              width={1200}
              height={1200}
              className="w-full aspect-square object-cover"
            />
          </div>
          <div className="md:col-span-7 md:order-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
              {t("home.box.kicker")}
            </span>
            <h3 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
              {t("home.box.title1")} <br />
              <span className="italic">{t("home.box.title2")}</span>
            </h3>
            <p className="mt-6 max-w-md leading-relaxed opacity-80">
              {t("home.box.body")}
            </p>
            <Link
              to="/box"
              className="mt-8 inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] group"
            >
              <span>{t("home.box.cta")}</span>
              <span className="block w-8 h-px bg-paper transition-all duration-500 group-hover:w-12" />
            </Link>
          </div>
        </div>
      </section>

      {/* MISSION TEASER */}
      <section className="relative py-32 md:py-40 px-6 md:px-8 overflow-hidden">
        <img
          src={missionFarm}
          alt="Misty terraced vegetable farm in Miaoli at dawn"
          loading="lazy"
          width={1600}
          height={1000}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
            {t("home.mission.kicker")}
          </span>
          <p className="mt-8 font-display text-7xl md:text-9xl text-indigo-dye italic leading-none">
            94%
          </p>
          <p className="mt-6 font-display text-2xl md:text-3xl max-w-2xl mx-auto text-balance leading-snug text-foreground">
            {t("home.mission.body")}
          </p>
          <Link
            to="/mission"
            className="mt-10 inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-indigo-dye group"
          >
            <span>{t("home.mission.cta")}</span>
            <span className="block w-8 h-px bg-indigo-dye transition-all duration-500 group-hover:w-12" />
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-paper py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-clay">Mangshi / system</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">盒子背後的系統</h2>
            </div>
            <Link to="/system" className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-indigo-dye hover:text-foreground">
              {t("nav.system")} →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Link to="/system" className="group relative min-h-72 overflow-hidden">
              <img src={sealedBoxHands} alt="Student holding a sealed lunch box" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-foreground/35" />
              <div className="relative flex min-h-72 items-end p-6 text-paper"><p className="font-display text-3xl">收成，成為一餐。</p></div>
            </Link>
            <Link to="/system/match" className="group relative min-h-72 overflow-hidden">
              <img src={hakkaTable} alt="Simple Hakka dishes set on a table" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-foreground/35" />
              <div className="relative flex min-h-72 items-end p-6 text-paper"><p className="font-display text-3xl">每一口，都有來處。</p></div>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
