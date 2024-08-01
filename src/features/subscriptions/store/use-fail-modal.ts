import { create } from "zustand";

type FailModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useFailModal = create<FailModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));