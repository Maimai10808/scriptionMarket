"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatEther, parseEther } from "viem";
import { z } from "zod";
import {
  BadgeCheck,
  CalendarClock,
  FileSignature,
  Info,
  Loader2,
  PackagePlus,
  ShieldCheck,
  Signature,
} from "lucide-react";

import { MotionReveal } from "@/components/animations/MotionReveal";
import { useCreateListing } from "@/hooks/useCreateListing";
import { useListingStore } from "@/stores/listingStore";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const createListingSchema = z.object({
  tick: z
    .string()
    .min(1, "Tick is required.")
    .max(16, "Tick is too long.")
    .regex(/^[a-zA-Z0-9]+$/, "Tick only supports letters and numbers."),
  amount: z
    .string()
    .regex(/^\d+$/, "Amount must be an integer.")
    .refine(
      (value) => BigInt(value) > BigInt(0),
      "Amount must be greater than 0.",
    ),
  price: z
    .string()
    .min(1, "Price is required.")
    .regex(/^\d+(\.\d+)?$/, "Price must be a valid ETH amount.")
    .refine((value) => Number(value) > 0, "Price must be greater than 0."),
  orderNumber: z
    .string()
    .regex(/^\d+$/, "Order number must be an integer.")
    .refine(
      (value) => BigInt(value) > BigInt(0),
      "Order number must be greater than 0.",
    ),
  deadline: z.string().min(1, "Deadline is required."),
});

type CreateListingFormValues = z.infer<typeof createListingSchema>;

function getDefaultDeadline() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 16);
}

function getDefaultOrderNumber() {
  return String(Date.now());
}

function toUnixSeconds(dateValue: string) {
  const timestamp = new Date(dateValue).getTime();
  return Math.floor(timestamp / 1000);
}

export function CreateListingForm() {
  const listings = useListingStore((state) => state.listings);
  const pendingDraft = useListingStore((state) => state.pendingDraft);
  const isConfirmDialogOpen = useListingStore(
    (state) => state.isConfirmDialogOpen,
  );
  const setPendingDraft = useListingStore((state) => state.setPendingDraft);
  const closeConfirmDialog = useListingStore(
    (state) => state.closeConfirmDialog,
  );
  const clearPendingDraft = useListingStore((state) => state.clearPendingDraft);

  const {
    createListing,
    latestListing,
    isSigning,
    canSign,
    walletAddress,
    chainId,
  } = useCreateListing();

  const form = useForm<CreateListingFormValues>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      tick: "MSCMOCK",
      amount: "100",
      price: "1",
      orderNumber: getDefaultOrderNumber(),
      deadline: getDefaultDeadline(),
    },
  });

  const formErrors = form.formState.errors;

  const latestListingPreview = useMemo(() => {
    if (!latestListing) return null;

    return {
      number: latestListing.marketStorage.number.toString(),
      maker: latestListing.marketStorage.maker,
      time: latestListing.marketStorage.time.toString(),
      amount: latestListing.marketStorage.amount.toString(),
      price: `${formatEther(latestListing.marketStorage.price)} ETH`,
      tick: latestListing.marketStorage.tick,
      signature: latestListing.signature,
    };
  }, [latestListing]);

  const pendingPreview = useMemo(() => {
    if (!pendingDraft) return null;

    return {
      number: pendingDraft.orderNumber,
      maker: walletAddress ?? "-",
      time: String(toUnixSeconds(pendingDraft.deadline)),
      amount: pendingDraft.amount,
      price: `${pendingDraft.price} ETH`,
      priceWei: parseEther(pendingDraft.price).toString(),
      tick: pendingDraft.tick.trim().toUpperCase(),
      chainId,
    };
  }, [pendingDraft, walletAddress, chainId]);

  const onPrepare = (values: CreateListingFormValues) => {
    setPendingDraft(values);
  };

  const onConfirmSign = async () => {
    if (!pendingDraft) return;
    await createListing(pendingDraft);
  };

  return (
    <>
      <MotionReveal y={16} duration={0.35} className="w-full">
        <Card className="overflow-hidden border-zinc-800 bg-zinc-950 text-white shadow-xl">
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                  <FileSignature className="h-3.5 w-3.5 text-blue-300" />
                  Off-chain Signed Listing
                </div>

                <CardTitle className="text-2xl">Create Listing</CardTitle>
                <CardDescription className="mt-2 text-zinc-400">
                  Fill in basic order information first, then confirm the
                  structured payload before signing.
                </CardDescription>
              </div>

              <Badge variant={canSign ? "secondary" : "destructive"}>
                {canSign ? "Wallet Ready" : "Wallet Required"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="border-blue-500/30 bg-blue-500/10 text-blue-100">
              <Info className="h-4 w-4" />
              <AlertTitle>No gas listing</AlertTitle>
              <AlertDescription>
                The seller only signs EIP-712 structured data. No on-chain
                transaction is sent during listing creation.
              </AlertDescription>
            </Alert>

            <form
              onSubmit={form.handleSubmit(onPrepare)}
              className="grid gap-4 md:grid-cols-2"
            >
              <FieldBlock label="Tick" error={formErrors.tick?.message}>
                <Input
                  {...form.register("tick")}
                  placeholder="MSCMOCK"
                  className="border-zinc-700 bg-zinc-900 text-white"
                />
              </FieldBlock>

              <FieldBlock label="Amount" error={formErrors.amount?.message}>
                <Input
                  {...form.register("amount")}
                  placeholder="100"
                  inputMode="numeric"
                  className="border-zinc-700 bg-zinc-900 text-white"
                />
              </FieldBlock>

              <FieldBlock label="Price ETH" error={formErrors.price?.message}>
                <Input
                  {...form.register("price")}
                  placeholder="1"
                  inputMode="decimal"
                  className="border-zinc-700 bg-zinc-900 text-white"
                />
              </FieldBlock>

              <FieldBlock
                label="Order Number"
                error={formErrors.orderNumber?.message}
              >
                <Input
                  {...form.register("orderNumber")}
                  placeholder="10001"
                  inputMode="numeric"
                  className="border-zinc-700 bg-zinc-900 text-white"
                />
              </FieldBlock>

              <FieldBlock
                label="Deadline / Time"
                error={formErrors.deadline?.message}
                className="md:col-span-2"
              >
                <Input
                  {...form.register("deadline")}
                  type="datetime-local"
                  className="border-zinc-700 bg-zinc-900 text-white"
                />
              </FieldBlock>

              <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1 text-xs text-zinc-500">
                  <div>Signer: {walletAddress ?? "-"}</div>
                  <div>Chain ID: {chainId}</div>
                </div>

                <Button type="submit" disabled={!canSign}>
                  <PackagePlus className="mr-2 h-4 w-4" />
                  Prepare Listing
                </Button>
              </div>
            </form>

            {latestListingPreview && (
              <MotionReveal delay={0.05}>
                <Card className="border-emerald-500/30 bg-emerald-500/10 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BadgeCheck className="h-4 w-4 text-emerald-300" />
                      Listing Created
                    </CardTitle>
                    <CardDescription className="text-emerald-100/70">
                      This object can be used later by mscPurchase.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <pre className="max-h-80 overflow-auto rounded-xl border border-emerald-500/20 bg-black/30 p-4 text-xs leading-5 text-emerald-50">
                      {JSON.stringify(latestListingPreview, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </MotionReveal>
            )}

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                <ShieldCheck className="h-4 w-4 text-zinc-400" />
                Local Listings
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                {listings.length} signed listing
                {listings.length === 1 ? "" : "s"} stored in the local Zustand
                store.
              </p>
            </div>
          </CardContent>
        </Card>
      </MotionReveal>

      <Dialog
        open={isConfirmDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeConfirmDialog();
        }}
      >
        <DialogContent className="border-zinc-800 bg-zinc-950 text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Signature className="h-5 w-5 text-blue-300" />
              Confirm Listing Signature
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Review the structured listing payload before requesting wallet
              signature.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-100">
              <CalendarClock className="h-4 w-4" />
              <AlertTitle>This is not an on-chain transaction</AlertTitle>
              <AlertDescription>
                Your wallet will sign typed data only. The listing becomes
                executable when a buyer submits this order and signature to
                mscPurchase.
              </AlertDescription>
            </Alert>

            <div className="grid gap-3 md:grid-cols-2">
              <PreviewItem label="Tick" value={pendingPreview?.tick ?? "-"} />
              <PreviewItem
                label="Amount"
                value={pendingPreview?.amount ?? "-"}
              />
              <PreviewItem
                label="Price"
                value={pendingPreview?.price ?? "-"}
              />
              <PreviewItem
                label="Order Number"
                value={pendingPreview?.number ?? "-"}
              />
              <PreviewItem
                label="Deadline Unix"
                value={pendingPreview?.time ?? "-"}
              />
              <PreviewItem
                label="Chain ID"
                value={String(pendingPreview?.chainId ?? "-")}
              />
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="text-sm text-zinc-400">Maker / Signer</div>
              <div className="mt-2 break-all font-mono text-sm text-zinc-100">
                {pendingPreview?.maker ?? "-"}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-black/30 p-4">
              <div className="mb-2 text-sm font-medium text-zinc-300">
                Typed Data Preview
              </div>
              <pre className="max-h-64 overflow-auto text-xs leading-5 text-zinc-400">
                {JSON.stringify(pendingPreview, null, 2)}
              </pre>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="secondary"
              onClick={clearPendingDraft}
              disabled={isSigning}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={onConfirmSign}
              disabled={!canSign || isSigning || !pendingDraft}
            >
              {isSigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <Signature className="mr-2 h-4 w-4" />
                  Confirm & Sign
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FieldBlock({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-2 block text-sm text-zinc-300">{label}</Label>
      {children}
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-2 break-all text-sm font-medium text-zinc-100">
        {value}
      </div>
    </div>
  );
}
