import { Link } from "react-router-dom";
import { useLang } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border py-16 px-6 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-3">
        <div>
          <Link
            to="/"
            className="font-display italic text-2xl text-indigo-dye hover:opacity-80 transition-opacity"
          >
            Mangshi <span className="not-italic text-clay text-base">盲食</span>
          </Link>
          <p className="mt-4 text-sm text-clay leading-relaxed max-w-xs">
            {t("footer.tagline")}
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-clay/60">
            {t("footer.region")}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay/60 mb-1">
            {t("footer.explore")}
          </span>
          <Link to="/culture" className="text-sm hover:text-indigo-dye transition-colors duration-300 w-fit">
            {t("footer.link.culture")}
          </Link>
          <Link to="/system" className="text-sm hover:text-indigo-dye transition-colors duration-300 w-fit">
            {t("nav.system")}
          </Link>
          <Link to="/box" className="text-sm hover:text-indigo-dye transition-colors duration-300 w-fit">
            {t("footer.link.box")}
          </Link>
          <Link to="/mission" className="text-sm hover:text-indigo-dye transition-colors duration-300 w-fit">
            {t("footer.link.mission")}
          </Link>
          <Link to="/join" className="text-sm hover:text-indigo-dye transition-colors duration-300 w-fit">
            {t("footer.link.join")}
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay/60 mb-1">
            {t("footer.recognition")}
          </span>
          <span className="text-sm text-clay">{t("footer.award1")}</span>
          <span className="text-sm text-clay">{t("footer.award2")}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-clay/60">
        <span>{t("footer.copyright")}</span>
        <span>{t("footer.subline")}</span>
      </div>
    </footer>
  );
}
