import { create } from "zustand";

export type SwitcherAccount = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
} | null;

type AccountSwitcherStore = {
  active: SwitcherAccount;
  alt: SwitcherAccount;
  loading: boolean;
  load: () => Promise<void>;
  switchAccount: () => Promise<void>;
  signOutActive: () => Promise<void>;
};

function redirectForRole(role?: string) {
  window.location.href = role === "ADMIN" ? "/admin" : "/";
}

export const useAccountSwitcherStore = create<AccountSwitcherStore>((set) => ({
  active: null,
  alt: null,
  loading: false,

  load: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/account/list");
      if (!res.ok) return;
      const data = await res.json();
      set({ active: data.active ?? null, alt: data.alt ?? null });
    } finally {
      set({ loading: false });
    }
  },

  switchAccount: async () => {
    const res = await fetch("/api/account/switch", { method: "POST" });
    if (!res.ok) return;
    const data = await res.json();
    redirectForRole(data.role);
  },

  signOutActive: async () => {
    const res = await fetch("/api/account/signout", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (data.promoted) redirectForRole(data.role);
    else window.location.href = "/";
  },
}));
