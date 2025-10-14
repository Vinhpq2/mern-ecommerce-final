import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import type { UserStore } from "../types/userStore";
import { useLanguageStore } from "./useLanguagesStore";

type SignupPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export const useUserStore = create<UserStore>((set,get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }: SignupPayload) => {
    const { t } = useLanguageStore.getState(); 
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error(t.wrongPassword,{id:"signup" });
    }

    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data, loading: false });
      toast.success(t.signupSuccess,{id:"signup"});
    } catch{
      set({ loading: false });
        toast.error(t.signupFailed,{id:"signup"});
    }
  },

  login: async ({ email, password }: LoginPayload) => {
    const { t } = useLanguageStore.getState(); 
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data, loading: false });
      toast.success(t.loginSuccess,{id:"login"});
    } catch {
      set({ loading: false });
        toast.error(t.invalid,{id:"login"});
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const res = await axios.get("/auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch{
      set({ user: null, checkingAuth: false });
    }
  },

  logout: async () => {
    const { t } = useLanguageStore.getState(); 
    try {
      await axios.post("/auth/logout");
      set({ user: null });
      toast.success(t.logoutSuccess,{id:"logout"});
    } catch {
      toast.error(t.logoutFailed,{id:"logout"});
    }
  },

  refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
  
}));
let refreshPromise: Promise<string> | null = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);