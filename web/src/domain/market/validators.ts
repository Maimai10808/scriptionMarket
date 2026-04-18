import { isAddress } from "viem";

export type ListingFormInput = {
  number: string;
  maker: string;
  time: string;
  amount: string;
  price: string;
  tick: string;
};

export function validateListingInput(input: ListingFormInput): string[] {
  const errors: string[] = [];

  if (!input.maker || !isAddress(input.maker)) {
    errors.push("maker address is invalid");
  }
  if (!input.number || BigInt(input.number) <= BigInt(0)) {
    errors.push("number must be greater than 0");
  }
  if (!input.amount || BigInt(input.amount) <= BigInt(0)) {
    errors.push("amount must be greater than 0");
  }
  if (!input.price || BigInt(input.price) <= BigInt(0)) {
    errors.push("price must be greater than 0");
  }
  if (!input.time || BigInt(input.time) <= BigInt(0)) {
    errors.push("time must be greater than 0");
  }
  if (!input.tick.trim()) {
    errors.push("tick is required");
  }

  return errors;
}
