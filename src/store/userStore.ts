import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";

// Тип данных пользователя
export type User = {
  id: number;
  fullName: string;
  phoneNumber: string;
  password: string;
  balls: number;
  authorized: boolean;
  online: boolean;
  role: string;
  createdAt: string;
};

// Тип стора Zustand
type UserStore = {
  user: User | null;
  fetchUser: () => Promise<void>;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  fetchUser: async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      set({ user: response.data });
    } catch (error: any) {
      if (error?.response?.status === 401) {
        set({ user: null });
      }
      console.error("Failed to fetch user", error);
    }
  },

  logout: () => {
    set({ user: null });
    Cookies.remove("access_token");
  },
}));
