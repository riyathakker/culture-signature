import { create } from "zustand";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface CheckoutStore {
  shippingAddress: ShippingAddress;
  setShippingAddress: (address: Partial<ShippingAddress>) => void;
  resetCheckout: () => void;
}

const initialAddress: ShippingAddress = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "India",
  phone: "",
};

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  shippingAddress: initialAddress,
  setShippingAddress: (address) =>
    set((state) => ({
      shippingAddress: { ...state.shippingAddress, ...address },
    })),
  resetCheckout: () => set({ shippingAddress: initialAddress }),
}));
