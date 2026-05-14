export const en = {
  admin: {
    sidebar: {
      overview: "Overview",
      products: "Products",
      orders: "Orders",
      customers: "Customers",
      discounts: "Discounts",
      categories: "Categories",
      home: "Home",
    },
    products: {
      title: "Artisanal Catalog",
      description: "Curate and manage your collection of timeless masterpieces.",
      newProduct: "New Product",
      searchPlaceholder: "Search masterpieces...",
      table: {
        product: "Product",
        price: "Price",
        stock: "Stock",
        status: "Status",
        created: "Created",
      },
      status: {
        inStock: "In Stock",
        outOfStock: "Out of Stock",
        lowStock: "Low Stock",
      },
      actions: {
        edit: "Edit",
        remove: "Remove",
      }
    },
    orders: {
      title: "Orders",
      description: "Track and fulfill artisanal orders.",
      export: "Export Orders",
      searchPlaceholder: "Search order ID or customer...",
      table: {
        id: "Order ID",
        customer: "Customer",
        status: "Status",
        date: "Date",
        amount: "Amount",
      }
    },
    discounts: {
      title: "Privileges & Offers",
      description: "Curate exclusive experiences for your clientele.",
      newOffer: "New Offer",
      searchPlaceholder: "Search coupon codes...",
      filters: {
        status: "Status",
        all: "All Status",
        active: "Active",
        expired: "Expired"
      },
      table: {
        code: "Coupon Code",
        type: "Type",
        value: "Value",
        usage: "Usage",
        expires: "Expires",
        status: "Status"
      },
      empty: "No promotional offers match your criteria.",
      delete: {
        title: "Deactivate Privilege",
        description: "Are you sure you want to revoke the exclusive offer \"{code}\"? This action will prevent patrons from utilizing this coupon code."
      },
      dialog: {
        titleCreate: "Create New Privilege",
        titleEdit: "Modify Privilege",
        descCreate: "Design an exclusive offer for your most valued patrons.",
        descEdit: "Refine the terms of this exclusive offer.",
        labels: {
          code: "Coupon Code",
          type: "Type",
          value: "Value",
          usageLimit: "Usage Limit",
          expiryDate: "Expiry Date",
          status: "Status"
        },
        buttons: {
          create: "Curate Offer",
          edit: "Update Offer"
        }
      }
    },
    categories: {
      title: "Collection Clusters",
      description: "Organize your catalog into curated collections.",
      newCategory: "New Category",
      searchPlaceholder: "Search categories...",
      table: {
        collection: "Collection",
        slug: "Slug",
        description: "Description",
        products: "Products",
        status: "Status"
      },
      empty: "No collections match your search.",
      dialog: {
        titleCreate: "Initiate Collection",
        titleEdit: "Refine Collection",
        descCreate: "Establish a new category for your artisanal masterpieces.",
        descEdit: "Update the thematic details of this curated collection.",
        labels: {
          name: "Collection Name",
          slug: "Slug",
          description: "Thematic Description"
        },
        buttons: {
          create: "Establish Collection",
          edit: "Update Collection"
        }
      }
    },
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      actions: "Actions",
      noResults: "No results found.",
    }
  },
  cart: {
    summary: {
      title: "Order Summary",
      subtotal: "Subtotal",
      shipping: "Shipping",
      shippingValue: "Calculated at checkout",
      estimatedTax: "Estimated Tax (18% GST)",
      total: "Total",
      discount: "Discount",
      promotionalCode: "Promotional Code",
      codePlaceholder: "CODE",
      apply: "Apply",
      proceedToCheckout: "Proceed to Checkout",
      footerNote: "Complimentary shipping on orders above ₹5,000. <br/> Secure payment processed via Stripe.",
      badges: {
        expressDelivery: "Express Delivery",
        securePayment: "Secure Payment"
      },
      messages: {
        invalidCode: "Please enter a valid promotional code.",
        codeApplied: "Promotional code {code} applied!",
        codeRemoved: "Promotional code removed."
      }
    }
  },
  home: {
    hero: {
      established: "Established 2013",
      title1: "Artisanal",
      title2: "Heritage",
      description: "Celebrating the soul of Indian craftsmanship through handcrafted jewelry and artisanal bags. Founded by Jalpa Thakkar to empower through mastery.",
      imageAlt: "Luxury Jewelry"
    },
    categories: {
      title: "The Collections",
      subtitle: "Curated Heritage",
      pieces: "Pieces"
    },
    featured: {
      title: "Iconic Pieces",
      subtitle: "Handcrafted Legacy"
    },
    newArrivals: {
      title: "New Arrivals",
      subtitle: "Freshly Crafted"
    },
    celebSpotting: {
      title: "Celeb Spotting",
      subtitle: "Spotted in Culture Signature"
    },
    testimonials: {
      title: "Voices of Elegance",
      subtitle: "From Our Patrons",
      reviews: [
        {
          quote: "The craftsmanship is unparalleled. Each piece tells a story of heritage and modern elegance.",
          author: "Priya R.",
          location: "Mumbai"
        },
        {
          quote: "Culture Signature's bags are not just accessories; they are wearable art. Truly magnificent.",
          author: "Anjali S.",
          location: "New York"
        },
        {
          quote: "I wore their handcrafted necklace for my wedding, and it felt like carrying a piece of history.",
          author: "Meera K.",
          location: "London"
        }
      ]
    },
    faq: {
      title: "Common Inquiries",
      subtitle: "Your Questions Answered",
      questions: [
        {
          question: "How do I care for my artisanal jewelry?",
          answer: "Store your pieces in the provided velvet pouches. Avoid direct contact with perfumes and harsh chemicals. Gently wipe with a soft cloth after use."
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes, we ship globally. Complimentary shipping is provided on orders above ₹5,000 to ensure your masterpieces reach you safely."
        },
        {
          question: "Are the bags made from genuine leather?",
          answer: "We offer both premium genuine leather and high-quality sustainable vegan leather options, all handcrafted by skilled artisans."
        },
        {
          question: "What is your return policy?",
          answer: "We offer a 14-day return window for unworn items in their original packaging. Custom pieces are non-refundable."
        }
      ]
    }
  }
};

export type Translations = typeof en;
