import { create } from "zustand";

type SubScriptionModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSubscriptionModal = create<SubScriptionModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));