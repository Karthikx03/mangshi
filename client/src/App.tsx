import { Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useLang } from "@/lib/i18n";
import { SiteNav } from "@/components/SiteNav";
import { PageSkeleton } from "@/components/PageSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NotFound } from "@/components/NotFound";

import Home from "@/pages/index";
import Culture from "@/pages/culture";
import BoxPage from "@/pages/box";
import Mission from "@/pages/mission";
import SeasonsPage from "@/pages/seasons";
import Join from "@/pages/join";
import SystemLayout from "@/pages/system";
import SystemOverview from "@/pages/system.index";
import SupplyScreen from "@/pages/system.supply";
import MatchScreen from "@/pages/system.match";
import KitchenScreen from "@/pages/system.kitchen";
import ImpactScreen from "@/pages/system.impact";
import RecipeLibraryScreen from "@/pages/system.recipes";

/** Scrolls to the top on every route change, like a normal page load. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Keeps <html lang> in sync with the language toggle. */
function HtmlLang() {
  const { lang } = useLang();
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
  }, [lang]);
  return null;
}

const seasonsFallback = (
  <div className="min-h-screen bg-background flex flex-col">
    <SiteNav />
    <div className="pt-[4.5rem] flex-1">
      <PageSkeleton tiles={4} />
    </div>
  </div>
);

export default function App() {
  const { pathname } = useLocation();
  return (
    <>
      <ScrollToTop />
      <HtmlLang />
      <ErrorBoundary resetKey={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/culture" element={<Culture />} />
          <Route path="/box" element={<BoxPage />} />
          <Route path="/mission" element={<Mission />} />
          <Route
            path="/seasons"
            element={
              <Suspense fallback={seasonsFallback}>
                <SeasonsPage />
              </Suspense>
            }
          />
          <Route path="/join" element={<Join />} />
          <Route path="/system" element={<SystemLayout />}>
            <Route index element={<SystemOverview />} />
            <Route path="supply" element={<SupplyScreen />} />
            <Route path="match" element={<MatchScreen />} />
            <Route path="kitchen" element={<KitchenScreen />} />
            <Route path="impact" element={<ImpactScreen />} />
            <Route path="recipes" element={<RecipeLibraryScreen />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}
