"use client";

import { useState } from "react";
import type { Address } from "viem";

import { useWatchMscMarketV1MxcscriptionsProtocolTransferMsc20TokenEvent } from "@/generated/wagmi";

export type MarketTradeEvent = {
  id: string;
  from: Address;
  buyer: Address;
  number: bigint;
  amount: bigint;
  createdAt: number;
};

export function useMarketTradeEvents() {
  const [events, setEvents] = useState<MarketTradeEvent[]>([]);

  useWatchMscMarketV1MxcscriptionsProtocolTransferMsc20TokenEvent({
    onLogs: (logs) => {
      const nextEvents = logs.map((log) => ({
        id: `${log.transactionHash}-${log.logIndex}`,
        from: log.args.from!,
        buyer: log.args.buyer!,
        number: log.args.number!,
        amount: log.args.amount!,
        createdAt: Date.now(),
      }));

      setEvents((current) => [...nextEvents, ...current]);
    },
  });

  return {
    events,
  };
}
