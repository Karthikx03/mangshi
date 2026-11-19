import { NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageSkeleton } from "@/components/PageSkeleton";
import { useLang } from "@/lib/i18n";
import { systemQueryOptions } from "@/lib/systemQuery";

export default function SystemLayout() {
  const { t } = useLang();
  // Every /system/* tab reads this same snapshot; load it once here so child pages can
  // assume data is present.
  const { isPending, isError, refetch } = useQuery(systemQueryOptions);
  const tabs = [
    { to: "/system", label: t("sys.tab.overview"), exact: true },
    { to: "/system/supply", label: t("sys.tab.supply") },
    { to: "/system/match", label: t("sys.tab.match") },
    { to: "/system/kitchen", label: t("sys.tab.kitchen") },
    { to: "/system/impact", label: t("sys.tab.impact") },
    { to: "/system/recipes", label: t("sys.tab.recipes") },
  ] as const;

  // On phone widths this row overflows and scrolls horizontally with no visible hint that
  // "Recipes" is off-screen. Track scroll position so a fade only shows on the side that
  // actually has more to scroll to, and clears once you've scrolled all the way there.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollShadows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollShadows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollShadows, { passive: true });
    window.addEventListener("resize", updateScrollShadows);
    return () => {
      el.removeEventListener("scroll", updateScrollShadows);
      window.removeEventListener("resize", updateScrollShadows);
    };
  }, [updateScrollShadows, tabs.length]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />
      <div className="pt-[4.5rem] flex-1">
        <div className="sticky top-[4.5rem] z-40 bg-background/90 backdrop-blur-md border-b border-border relative">
          <div
            ref={scrollRef}
            className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex gap-5 sm:gap-8 overflow-x-auto py-3 text-[11px] uppercase tracking-[0.2em] text-clay"
          >
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={"exact" in tab}
                className={({ isActive }) =>
                  `whitespace-nowrap pb-1 hover:text-foreground transition-colors${
                    isActive ? " text-foreground border-b border-foreground" : ""
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
          {canScrollLeft && (
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent sm:hidden"
            />
          )}
          {canScrollRight && (
            <div
              aria-hidden
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent sm:hidden"
            />
          )}
        </div>
        {isPending ? (
          <PageSkeleton />
        ) : isError ? (
          <div className="flex min-h-[50vh] items-center justify-center px-6 text-center">
            <div>
              <p className="font-display text-2xl">系統資料暫時無法載入 · System data unavailable</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-6 border border-foreground px-5 py-2 text-[11px] uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors"
              >
                重試 · Retry
              </button>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
