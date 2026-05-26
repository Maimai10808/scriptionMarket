import { create } from "zustand";

type ProtocolStatusState = {
  featureName: string;
  priceInput: string;
  setFeatureName: (featureName: string) => void;
  setPriceInput: (priceInput: string) => void;
};

export const useProtocolStatusStore = create<ProtocolStatusState>((set) => ({
  featureName: "purchase",
  priceInput: "1",

  setFeatureName: (featureName) => set({ featureName }),
  setPriceInput: (priceInput) => set({ priceInput }),
}));
