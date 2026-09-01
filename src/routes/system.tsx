import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";
import { systemQueryOptions } from "@/lib/systemQuery";

export const Route = createFileRoute("/system")({
  loader: ({ context }) => context.queryClient.ensureQueryData(systemQueryOptions),
  component: SystemLayout,
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />
      <div className="pt-[4.5rem] flex-1">
        <div className="sticky top-[4.5rem] z-40 bg-background/90 backdrop-blur-md border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex gap-5 sm:gap-8 overflow-x-auto py-3 text-[11px] uppercase tracking-[0.2em] text-clay">
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
        </div>
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  );
}
