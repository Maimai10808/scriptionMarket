import { create } from "zustand";

type AdminConsoleState = {
  batchPurchaseEnabledInUi: boolean;
  setBatchPurchaseEnabledInUi: (enabled: boolean) => void;
};

export const useAdminConsoleStore = create<AdminConsoleState>((set) => ({
  batchPurchaseEnabledInUi: true,

  setBatchPurchaseEnabledInUi: (enabled) =>
    set({
      batchPurchaseEnabledInUi: enabled,
    }),
}));
