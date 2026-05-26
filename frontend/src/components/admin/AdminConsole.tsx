"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  CircleAlert,
  Loader2,
  LockKeyhole,
  RefreshCcw,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  ToggleLeft,
  Wallet,
} from "lucide-react";

import { MotionReveal } from "@/components/animations/MotionReveal";
import { useAdminConsole } from "@/hooks/useAdminConsole";
import { useAdminConsoleStore } from "@/stores/adminConsoleStore";

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
import { Label } from "@/components/ui/label";

type AdminConsoleFormValues = {
  feeBps: string;
  adminAddress: string;
};

function formatBooleanStatus(value?: boolean) {
  if (value === undefined) return "-";
  return value ? "Enabled" : "Disabled";
}

function shortenAddress(address?: string) {
  if (!address) return "-";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function AdminConsole() {
  const {
    proxyAddress,
    connectedAddress,
    owner,
    adminAddress,
    feeBps,
    buyEnabled,
    listEnabled,
    withdrawEnabled,
    isOwner,
    isReading,
    isWriting,
    isConfirming,
    isSuccess,
    transactionHash,
    error,
    refetch,
    setFeeBps,
    setAdminAddress,
    setBuyFeatureStatus,
    setListFeatureStatus,
    setWithdrawFeatureStatus,
    setAllFeatureStatus,
  } = useAdminConsole();

  const {
    batchPurchaseEnabledInUi,
    setBatchPurchaseEnabledInUi,
  } = useAdminConsoleStore();

  const form = useForm<AdminConsoleFormValues>({
    defaultValues: {
      feeBps: "",
      adminAddress: "",
    },
  });

  useEffect(() => {
    if (feeBps !== undefined) {
      form.setValue("feeBps", feeBps.toString());
    }
  }, [feeBps, form]);

  useEffect(() => {
    if (adminAddress) {
      form.setValue("adminAddress", adminAddress);
    }
  }, [adminAddress, form]);

  const isBusy = isWriting || isConfirming;

  const handleSetFee = async () => {
    const value = form.getValues("feeBps");
    await setFeeBps(Number(value));
    refetch();
  };

  const handleSetAdminAddress = async () => {
    const value = form.getValues("adminAddress");
    await setAdminAddress(value);
    refetch();
  };

  return (
    <MotionReveal y={16} duration={0.35} className="w-full">
      <Card className="overflow-hidden border-zinc-800 bg-zinc-950 text-white shadow-xl">
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-300" />
                Admin Console
              </div>

              <CardTitle className="text-2xl">Protocol Admin</CardTitle>
              <CardDescription className="mt-2 text-zinc-400">
                Manage fee settings, admin address, and protocol feature
                switches. Upgrade actions should stay in Foundry scripts.
              </CardDescription>
            </div>

            <Badge variant={isOwner ? "secondary" : "destructive"}>
              {isOwner ? "Owner Connected" : "Owner Required"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!isOwner && (
            <Alert variant="destructive">
              <LockKeyhole className="h-4 w-4" />
              <AlertTitle>Admin permission required</AlertTitle>
              <AlertDescription>
                The connected wallet is not the contract owner. Write actions
                will revert unless you switch to the owner wallet.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <CircleAlert className="h-4 w-4" />
              <AlertTitle>Admin operation failed</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {isSuccess && transactionHash && (
            <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-100">
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>Transaction confirmed</AlertTitle>
              <AlertDescription>
                Latest admin transaction:{" "}
                <span className="font-mono">{transactionHash}</span>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <AdminMetric
              label="Connected Wallet"
              value={shortenAddress(connectedAddress)}
              icon={<Wallet className="h-4 w-4" />}
            />

            <AdminMetric
              label="Contract Owner"
              value={shortenAddress(owner)}
              icon={<ShieldCheck className="h-4 w-4" />}
            />

            <AdminMetric
              label="Proxy Address"
              value={shortenAddress(proxyAddress)}
              icon={<Settings className="h-4 w-4" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-zinc-800 bg-zinc-900 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <SlidersHorizontal className="h-4 w-4 text-blue-300" />
                  Fee Settings
                </CardTitle>
                <CardDescription className="text-zinc-500">
                  Calls setFeeBps(newFeeBps). Current fee is in basis points.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block text-sm text-zinc-300">
                    Fee Bps
                  </Label>
                  <Input
                    {...form.register("feeBps")}
                    inputMode="numeric"
                    placeholder="2"
                    className="border-zinc-700 bg-zinc-950 text-white"
                  />
                  <p className="mt-2 text-xs text-zinc-500">
                    Current: {feeBps !== undefined ? feeBps.toString() : "-"}{" "}
                    bps
                  </p>
                </div>

                <Button
                  type="button"
                  disabled={!isOwner || isBusy}
                  onClick={handleSetFee}
                >
                  {isBusy ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                  )}
                  Update Fee
                </Button>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wallet className="h-4 w-4 text-blue-300" />
                  Admin Address
                </CardTitle>
                <CardDescription className="text-zinc-500">
                  Calls setAdminAddress(newAdminAddress). This also transfers
                  ownership in the current contract.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block text-sm text-zinc-300">
                    Admin Address
                  </Label>
                  <Input
                    {...form.register("adminAddress")}
                    placeholder="0x..."
                    className="border-zinc-700 bg-zinc-950 font-mono text-sm text-white"
                  />
                  <p className="mt-2 break-all text-xs text-zinc-500">
                    Current: {adminAddress ?? "-"}
                  </p>
                </div>

                <Button
                  type="button"
                  disabled={!isOwner || isBusy}
                  onClick={handleSetAdminAddress}
                >
                  {isBusy ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wallet className="mr-2 h-4 w-4" />
                  )}
                  Update Admin
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-zinc-800 bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ToggleLeft className="h-4 w-4 text-blue-300" />
                Feature Switches
              </CardTitle>
              <CardDescription className="text-zinc-500">
                Control protocol feature switches. Batch purchase is currently a
                frontend UI switch unless the contract adds a batchBuy feature.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <FeatureSwitchCard
                  title="Listing Feature"
                  description='Calls setFeatureStatus("list", enabled).'
                  status={formatBooleanStatus(listEnabled)}
                  enabled={Boolean(listEnabled)}
                  disabled={!isOwner || isBusy}
                  onEnable={() => setListFeatureStatus(true)}
                  onDisable={() => setListFeatureStatus(false)}
                />

                <FeatureSwitchCard
                  title="Buy Feature"
                  description='Calls setFeatureStatus("buy", enabled). Applies to both single and batch purchase in current contract.'
                  status={formatBooleanStatus(buyEnabled)}
                  enabled={Boolean(buyEnabled)}
                  disabled={!isOwner || isBusy}
                  onEnable={() => setBuyFeatureStatus(true)}
                  onDisable={() => setBuyFeatureStatus(false)}
                />

                <FeatureSwitchCard
                  title="Withdraw Feature"
                  description='Calls setFeatureStatus("withdraw", enabled).'
                  status={formatBooleanStatus(withdrawEnabled)}
                  enabled={Boolean(withdrawEnabled)}
                  disabled={!isOwner || isBusy}
                  onEnable={() => setWithdrawFeatureStatus(true)}
                  onDisable={() => setWithdrawFeatureStatus(false)}
                />

                <FeatureSwitchCard
                  title="Batch Purchase UI"
                  description="Frontend-only switch. Hide or show batch purchase action in the DApp."
                  status={batchPurchaseEnabledInUi ? "Enabled" : "Disabled"}
                  enabled={batchPurchaseEnabledInUi}
                  disabled={false}
                  onEnable={() => setBatchPurchaseEnabledInUi(true)}
                  onDisable={() => setBatchPurchaseEnabledInUi(false)}
                />
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={!isOwner || isBusy}
                  onClick={() => setAllFeatureStatus(true)}
                >
                  Enable All Contract Features
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  disabled={!isOwner || isBusy}
                  onClick={() => setAllFeatureStatus(false)}
                >
                  Disable All Contract Features
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  disabled={isReading}
                  onClick={refetch}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </MotionReveal>
  );
}

function AdminMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-zinc-800 bg-zinc-900 text-white">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <div className="text-xs text-zinc-500">{label}</div>
          <div className="mt-1 break-all font-mono text-sm font-medium">
            {value}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-2 text-zinc-400">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureSwitchCard({
  title,
  description,
  status,
  enabled,
  disabled,
  onEnable,
  onDisable,
}: {
  title: string;
  description: string;
  status: string;
  enabled: boolean;
  disabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-zinc-100">{title}</div>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            {description}
          </p>
        </div>

        <Badge variant={enabled ? "default" : "secondary"}>{status}</Badge>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={disabled || enabled}
          onClick={onEnable}
        >
          Enable
        </Button>

        <Button
          type="button"
          size="sm"
          variant="destructive"
          disabled={disabled || !enabled}
          onClick={onDisable}
        >
          Disable
        </Button>
      </div>
    </div>
  );
}
