"use client";

import { LayoutDashboard, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export type AppView = "market" | "admin";

type AppNavigationProps = {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
};

export function AppNavigation({
  activeView,
  onViewChange,
}: AppNavigationProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-zinc-800 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <div className="text-lg font-semibold text-white">
            Scription Market
          </div>
          <div className="text-xs text-zinc-500">
            Off-chain signed listing marketplace
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-1">
          <Button
            type="button"
            size="sm"
            variant={activeView === "market" ? "secondary" : "ghost"}
            className="gap-2"
            onClick={() => onViewChange("market")}
          >
            <LayoutDashboard className="h-4 w-4" />
            Market
          </Button>

          <Button
            type="button"
            size="sm"
            variant={activeView === "admin" ? "secondary" : "ghost"}
            className="gap-2"
            onClick={() => onViewChange("admin")}
          >
            <ShieldCheck className="h-4 w-4" />
            Admin
          </Button>
        </div>
      </div>
    </div>
  );
}
