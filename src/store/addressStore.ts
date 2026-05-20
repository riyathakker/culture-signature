import { create } from "zustand";
import { AddressService } from "@/services/address";

interface AddressStore {
  createAddress: (data: any) => Promise<any>;
  updateAddress: (data: any) => Promise<any>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (address: any) => Promise<any>;
}

export const useAddressStore = create<AddressStore>(() => ({
  createAddress: async (data) => {
    return AddressService.createAddress(data);
  },
  updateAddress: async (data) => {
    return AddressService.updateAddress(data);
  },
  deleteAddress: async (id) => {
    await AddressService.deleteAddress(id);
  },
  setDefaultAddress: async (address) => {
    return AddressService.updateAddress({ ...address, isDefault: true });
  },
}));
