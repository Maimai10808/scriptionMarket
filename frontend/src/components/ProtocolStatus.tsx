/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { formatEther } from "viem";
import {
  Activity,
  BadgeCheck,
  Calculator,
  CircleAlert,
  Gauge,
  KeyRound,
  Loader2,
  RotateCcw,
  ShieldCheck,
  ToggleLeft,
  WalletCards,
} from "lucide-react";

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
      <Card className="overflow-hidden border-zinc-800 bg-zinc-950 text-white shadow-xl">
        <CardHeader className="relative">
          <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-300" />
                MscMarketV1 Read Panel
              </div>

              <CardTitle className="text-2xl">Protocol Status</CardTitle>
              <CardDescription className="mt-2 text-zinc-400">
                Read MscMarketV1 protocol configuration from the deployed proxy
                contract.
              </CardDescription>
            </div>

            <Badge
              variant={error ? "destructive" : "secondary"}
              className="w-fit gap-1.5 rounded-full px-3 py-1"
            >
              {error ? (
                <>
                  <CircleAlert className="h-3.5 w-3.5" />
                  Read Failed
                </>
              ) : isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading
                </>
              ) : (
                <>
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Connected
                </>
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <MotionReveal delay={0.02}>
              <Alert variant="destructive">
                <CircleAlert className="h-4 w-4" />
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
              <StatusCard
                icon={<WalletCards className="h-5 w-5" />}
                title="Proxy Address"
                value={proxyAddress}
                description="Frontend should interact with the proxy address."
                mono
              />
            </MotionReveal>

            <MotionReveal delay={0.06}>
              <StatusCard
                icon={<Activity className="h-5 w-5" />}
                title="Contract Version"
                value={version !== undefined ? version.toString() : "-"}
                description="Current MscMarketV1 implementation version."
              />
            </MotionReveal>

            <MotionReveal delay={0.09}>
              <StatusCard
                icon={<KeyRound className="h-5 w-5" />}
                title="Admin Address"
                value={adminAddress ?? "-"}
                description="Protocol admin or settlement address."
                mono
              />
            </MotionReveal>

            <MotionReveal delay={0.12}>
              <StatusCard
                icon={<Gauge className="h-5 w-5" />}
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
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <ToggleLeft className="h-4 w-4 text-zinc-400" />
                        Feature Status
                      </CardTitle>
                      <CardDescription className="mt-1 text-zinc-500">
                        Calls getFeatureStatus(feature).
                      </CardDescription>
                    </div>

                    <Badge variant="outline" className="border-zinc-700">
                      Read
                    </Badge>
                  </div>
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
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Calculator className="h-4 w-4 text-zinc-400" />
                        Compute Fee
                      </CardTitle>
                      <CardDescription className="mt-1 text-zinc-500">
                        Calls computeFee(price). Input unit is ETH.
                      </CardDescription>
                    </div>

                    <Badge variant="outline" className="border-zinc-700">
                      ETH
                    </Badge>
                  </div>
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
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
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
  icon,
  title,
  value,
  description,
  mono,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description?: string;
  mono?: boolean;
}) {
  return (
    <Card className="group h-full border-zinc-800 bg-zinc-900 text-white transition-colors hover:border-zinc-600">
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-2 text-zinc-400 transition-colors group-hover:text-white">
            {icon}
          </div>
        </div>

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
          <p className="mt-2 text-xs leading-5 text-zinc-500">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
