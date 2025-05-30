import { create } from "zustand";

type SidebarState = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  setOpen: (value) => set({ isOpen: value }),
}));

export default useSidebarStore;
