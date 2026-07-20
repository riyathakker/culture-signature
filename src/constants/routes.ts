export const ROUTES = {
  HOME: "/",
  NEW_ARRIVALS: "/new-arrivals",
  COLLECTIONS: "/collections",
  CATEGORIES: "/categories",
  ABOUT_US: "/about-us",
  CONTACT_US: "/contact-us",
  WISHLIST: "/wishlist",
  SHOPPING_BAG: "/bag",
  FAQ:"/faq",
  PRIVACY: "/privacy",
  REFUND: "/refund",
  TERMS: "/terms",
  SHIPPING: "/shipping",
  ADMIN: {
    DASHBOARD: "/admin",
    PRODUCTS: "/admin/products",
    PRODUCTS_NEW: "/admin/products/new",
    PRODUCTS_BULK: "/admin/products/bulk",
    PRODUCTS_EDIT: (id: string) => `/admin/products/${id}`,
    ORDERS: "/admin/orders",
    CUSTOMERS: "/admin/customers",
    DISCOUNTS: "/admin/discounts",
    DISCOUNTS_NEW: "/admin/discounts/new",
    CATEGORIES: "/admin/categories",
    CONTENT: "/admin/content",
    REVIEWS: "/admin/reviews",
  },
  ACCOUNT: {
    DASHBOARD: "/account",
    ORDERS: "/account/orders",
    WISHLIST: "/account/wishlist",
    ADDRESSES: "/account/addresses",
    SETTINGS: "/account/settings",
  },
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
  }
};

export const API_ROUTES = {
  ADMIN: {
    OVERVIEW: "/api/admin/overview",
    PRODUCTS: "/api/admin/products",
    PRODUCT_BY_ID: (id: string) => `/api/admin/products/${id}`,
    ORDERS: "/api/admin/orders",
    CUSTOMERS: "/api/admin/users",
    DISCOUNTS: "/api/admin/discounts",
    CATEGORIES: "/api/admin/categories",
    EXHIBITIONS: "/api/admin/content/exhibitions",
    EXHIBITION_BY_ID: (id: string) => `/api/admin/content/exhibitions/${id}`,
  }
};
