import type { SignedListing } from "@/lib/contracts/types";
import {
  parseSignedListingJson,
  serializeSignedListing,
} from "@/lib/contracts/formatters";

const STORAGE_KEY = "msc-market:signed-listings";

export function loadSignedListings(): SignedListing[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const entries = JSON.parse(raw) as string[];
    return entries.map((entry) => parseSignedListingJson(entry));
  } catch {
    return [];
  }
}

export function saveSignedListing(listing: SignedListing) {
  if (typeof window === "undefined") {
    return;
  }

  const existing = loadSignedListings();
  const serialized = serializeSignedListing(listing);
  const deduped = [
    serialized,
    ...existing
      .map((entry) => serializeSignedListing(entry))
      .filter((entry) => entry !== serialized),
  ];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped.slice(0, 10)));
}
