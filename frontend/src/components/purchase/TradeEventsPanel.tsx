"use client";

import { BadgeCheck, RadioTower } from "lucide-react";

import { useMarketTradeEvents } from "@/hooks/useMarketTradeEvents";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function TradeEventsPanel() {
  const { events } = useMarketTradeEvents();

  return (
    <Card className="border-zinc-800 bg-zinc-950 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <RadioTower className="h-5 w-5 text-blue-300" />
          Trade Events
        </CardTitle>
      </CardHeader>

      <CardContent>
        {events.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center text-sm text-zinc-500">
            No purchase events captured yet.
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="secondary" className="gap-1">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Filled
                  </Badge>
                  <div className="text-xs text-zinc-500">
                    Order #{event.number.toString()}
                  </div>
                </div>

                <div className="grid gap-2 text-sm text-zinc-300 md:grid-cols-3">
                  <div>Seller: {shortenAddress(event.from)}</div>
                  <div>Buyer: {shortenAddress(event.buyer)}</div>
                  <div>Amount: {event.amount.toString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
