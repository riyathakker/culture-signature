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
  paymentMethod: "STRIPE" | "COD";
  setShippingAddress: (address: Partial<ShippingAddress>) => void;
  setPaymentMethod: (method: "STRIPE" | "COD") => void;
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
  paymentMethod: "STRIPE",
  setShippingAddress: (address) =>
    set((state) => ({
      shippingAddress: { ...state.shippingAddress, ...address },
    })),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  resetCheckout: () => set({ shippingAddress: initialAddress, paymentMethod: "STRIPE" }),
}));
