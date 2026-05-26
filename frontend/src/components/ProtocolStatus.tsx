/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { formatEther } from "viem";

import { useProtocolStatus } from "@/hooks/useProtocolStatus";
import { useProtocolStatusStore } from "@/stores/protocolStatusStore";
import { MotionReveal } from "@/components/animations/MotionReveal";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type ProtocolStatusFormValues = {
  featureName: string;
  priceInput: string;
};

export function ProtocolStatus() {
  const { featureName, priceInput, setFeatureName, setPriceInput } =
    useProtocolStatusStore();

  const form = useForm<ProtocolStatusFormValues>({
    defaultValues: {
      featureName,
      priceInput,
    },
  });

  const watchedFeatureName = form.watch("featureName");
  const watchedPriceInput = form.watch("priceInput");

  useEffect(() => {
    setFeatureName(watchedFeatureName);
  }, [watchedFeatureName, setFeatureName]);

  useEffect(() => {
    setPriceInput(watchedPriceInput);
  }, [watchedPriceInput, setPriceInput]);

  const {
    proxyAddress,
    version,
    feeBps,
    adminAddress,
    featureEnabled,
    computedFee,
    isLoading,
    error,
  } = useProtocolStatus({
    featureName,
    priceInput,
  });

  const handleReset = () => {
    form.reset({
      featureName: "purchase",
      priceInput: "1",
    });

    setFeatureName("purchase");
    setPriceInput("1");
  };

  return (
    <MotionReveal y={16} duration={0.35} className="w-full">
      <Card className="border-zinc-800 bg-zinc-950 text-white shadow-xl">
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-2xl">Protocol Status</CardTitle>
              <CardDescription className="mt-2 text-zinc-400">
                Read MscMarketV1 protocol configuration from the deployed proxy
                contract.
              </CardDescription>
            </div>

            <Badge
              variant={error ? "destructive" : "secondary"}
              className="w-fit"
            >
              {error ? "Read Failed" : isLoading ? "Loading" : "Connected"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <MotionReveal delay={0.02}>
              <Alert variant="destructive">
                <AlertTitle>Contract read failed</AlertTitle>
                <AlertDescription>
                  Please check your wallet network, RPC endpoint, generated
                  contract address, and whether Anvil is running.
                </AlertDescription>
              </Alert>
            </MotionReveal>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <MotionReveal delay={0.03}>
              <StatusCard title="Proxy Address" value={proxyAddress} mono />
            </MotionReveal>

            <MotionReveal delay={0.06}>
              <StatusCard
                title="Contract Version"
                value={version !== undefined ? version.toString() : "-"}
              />
            </MotionReveal>

            <MotionReveal delay={0.09}>
              <StatusCard
                title="Admin Address"
                value={adminAddress ?? "-"}
                mono
              />
            </MotionReveal>

            <MotionReveal delay={0.12}>
              <StatusCard
                title="Fee Bps"
                value={feeBps !== undefined ? feeBps.toString() : "-"}
                description="Basis points. 100 bps = 1%."
              />
            </MotionReveal>
          </div>

          <Separator className="bg-zinc-800" />

          <form className="grid gap-4 md:grid-cols-2">
            <MotionReveal delay={0.15}>
              <Card className="border-zinc-800 bg-zinc-900 text-white">
                <CardHeader>
                  <CardTitle className="text-base">Feature Status</CardTitle>
                  <CardDescription className="text-zinc-500">
                    Calls getFeatureStatus(feature).
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Input
                    {...form.register("featureName")}
                    placeholder="purchase"
                    className="border-zinc-700 bg-zinc-950 text-white"
                  />

                  <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                    <div>
                      <div className="text-sm text-zinc-400">
                        Current Status
                      </div>
                      <div className="mt-1 text-lg font-semibold">
                        {featureEnabled === undefined
                          ? "-"
                          : featureEnabled
                            ? "Enabled"
                            : "Disabled"}
                      </div>
                    </div>

                    <Badge variant={featureEnabled ? "default" : "secondary"}>
                      {featureEnabled ? "ON" : "OFF"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </MotionReveal>

            <MotionReveal delay={0.18}>
              <Card className="border-zinc-800 bg-zinc-900 text-white">
                <CardHeader>
                  <CardTitle className="text-base">Compute Fee</CardTitle>
                  <CardDescription className="text-zinc-500">
                    Calls computeFee(price). Input unit is ETH.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Input
                    {...form.register("priceInput")}
                    placeholder="1"
                    inputMode="decimal"
                    className="border-zinc-700 bg-zinc-950 text-white"
                  />

                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                    <div className="text-sm text-zinc-400">Computed Fee</div>
                    <div className="mt-1 text-lg font-semibold">
                      {computedFee !== undefined
                        ? `${formatEther(computedFee)} ETH`
                        : "-"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionReveal>

            <MotionReveal delay={0.21} className="md:col-span-2">
              <Button type="button" variant="secondary" onClick={handleReset}>
                Reset Inputs
              </Button>
            </MotionReveal>
          </form>
        </CardContent>
      </Card>
    </MotionReveal>
  );
}

function StatusCard({
  title,
  value,
  description,
  mono,
}: {
  title: string;
  value: string;
  description?: string;
  mono?: boolean;
}) {
  return (
    <Card className="border-zinc-800 bg-zinc-900 text-white">
      <CardContent className="p-4">
        <div className="text-sm text-zinc-400">{title}</div>

        <div
          className={[
            "mt-3 break-all text-lg font-medium text-white",
            mono ? "font-mono text-sm" : "",
          ].join(" ")}
        >
          {value}
        </div>

        {description && (
          <p className="mt-2 text-xs text-zinc-500">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
