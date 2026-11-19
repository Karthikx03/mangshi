import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { useLang } from "@/lib/i18n";

export function SiteNav() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/system", label: t("nav.system") },
    { to: "/culture", label: t("nav.culture") },
    { to: "/box", label: t("nav.box") },
    { to: "/mission", label: t("nav.mission") },
    { to: "/seasons", label: t("nav.seasons") },
    { to: "/join", label: t("nav.join") },
  ] as const;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const LangToggle = (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center font-mono text-[10px] uppercase tracking-[0.2em] border border-border rounded-full overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setLang("zh")}
        aria-pressed={lang === "zh"}
        className={`px-2.5 py-1 transition-colors ${
          lang === "zh" ? "bg-foreground text-background" : "text-clay hover:text-foreground"
        }`}
      >
        中
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`px-2.5 py-1 transition-colors ${
          lang === "en" ? "bg-foreground text-background" : "text-clay hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-[4.5rem] flex items-center justify-between gap-3">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 sm:gap-3.5 group min-w-0"
        >
          <img
            src={logo}
            alt="Mangshi 盲食"
            width={56}
            height={56}
            className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover shrink-0 ring-2 ring-border group-hover:ring-indigo-dye/30 transition-all duration-500"
          />
          <span className="font-display italic text-xl sm:text-2xl md:text-3xl tracking-tight text-foreground truncate">
            Mangshi <span className="not-italic text-clay text-sm sm:text-base md:text-lg">盲食</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex gap-10 text-[11px] uppercase tracking-[0.2em] font-medium text-clay">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `relative py-1 hover:text-foreground transition-colors duration-300${isActive ? " text-foreground" : ""}`
                }
              >
                {l.label}
                <span className="absolute bottom-0 left-0 w-full h-px bg-foreground scale-x-0 group-[.active]:scale-x-100 transition-transform duration-300 origin-left" />
              </NavLink>
            ))}
          </div>
          {LangToggle}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          {LangToggle}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="p-2 -mr-2 text-foreground hover:bg-foreground/5 rounded-full transition-colors"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out border-t border-border bg-background ${
          open ? "max-h-[28rem]" : "max-h-0"
        }`}
      >
        <div className="px-6 py-8 flex flex-col gap-6 text-sm uppercase tracking-[0.2em] font-medium text-clay">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `hover:text-foreground transition-colors py-1${isActive ? " text-foreground" : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
