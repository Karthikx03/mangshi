import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageSkeleton } from "@/components/PageSkeleton";
import { useLang } from "@/lib/i18n";
import { systemQueryOptions } from "@/lib/systemQuery";

export const Route = createFileRoute("/system")({
  loader: ({ context }) => context.queryClient.ensureQueryData(systemQueryOptions),
  component: SystemLayout,
  pendingComponent: () => (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />
      <div className="pt-[4.5rem] flex-1">
        <PageSkeleton />
      </div>
    </div>
  ),
  pendingMs: 200,
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <p className="font-display text-2xl">系統資料暫時無法載入 · System data unavailable</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">Not found</div>
  ),
});

function SystemLayout() {
  const { t } = useLang();
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
              <Link
                key={tab.to}
                to={tab.to}
                activeOptions={{ exact: "exact" in tab }}
                activeProps={{ className: "text-foreground border-b border-foreground" }}
                className="whitespace-nowrap pb-1 hover:text-foreground transition-colors"
              >
                {tab.label}
              </Link>
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
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  );
}
