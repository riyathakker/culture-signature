import { create } from "zustand";
import { AddressService } from "@/services/address";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface AddressStore {
  addresses: Address[];
  isLoading: boolean;

  fetchAddresses: () => Promise<void>;
  createAddress: (data: any) => Promise<any>;
  updateAddress: (data: any) => Promise<any>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (address: any) => Promise<any>;
}

export const useAddressStore = create<AddressStore>((set, get) => ({
  addresses: [],
  isLoading: false,

  fetchAddresses: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const res = await fetch("/api/user/address");
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const addresses = await res.json();
      set({ addresses, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  createAddress: async (data) => {
    const result = await AddressService.createAddress(data);
    set((s) => ({ addresses: [...s.addresses, result] }));
    return result;
  },

  updateAddress: async (data) => {
    const result = await AddressService.updateAddress(data);
    set((s) => ({ addresses: s.addresses.map((a) => (a.id === data.id ? result : a)) }));
    return result;
  },

  deleteAddress: async (id) => {
    await AddressService.deleteAddress(id);
    set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) }));
  },

  setDefaultAddress: async (address) => {
    const result = await AddressService.updateAddress({ ...address, isDefault: true });
    set((s) => ({
      addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === address.id })).map((a) => (a.id === address.id ? result : a)),
    }));
    return result;
  },
}));
