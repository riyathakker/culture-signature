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
    },
    products: {
      title: "Artisanal Catalog",
      description: "Curate and manage your collection of timeless masterpieces.",
      newProduct: "New Product",
      searchPlaceholder: "Search masterpieces...",
      noResults: "No masterpieces match your current search criteria.",
      doubleClick: "Double click to edit",
      columns: {
        product: "Product",
        price: "Price",
        discount: "Discount",
        stock: "Stock",
        featured: "Featured",
        status: "Status",
        created: "Created",
        actions: "Actions",
      },
      status: {
        inStock: "In Stock",
        lowStock: "Low Stock",
        outOfStock: "Out of Stock",
        allStock: "All Stock",
      },
      categories: {
        label: "Categories",
        all: "All Categories",
      },
      actions: {
        edit: "Edit",
        remove: "Remove",
      },
      delete: {
        title: "Remove Masterpiece",
        description: "Are you sure you want to remove this product from the catalog? This action cannot be undone.",
        confirm: "Remove",
        success: "Masterpiece removed from the catalog.",
        error: "Failed to delete product",
      },
      messages: {
        updateSuccess: "{field} updated",
        updateError: "Failed to update",
        featuredSuccess: "Marked as Featured",
        unfeaturedSuccess: "Removed from Featured",
      }
    }
  },
  auth: {
    login: {
      title: "Great to have you back!",
      description: "Enter your details to access your account.",
      submit: "Sign in to your account",
      remember: "Remember",
      forgotPassword: "Lost?",
      newToBrand: "New to Culture Signature?",
      createAccount: "Create an Account",
      success: "Welcome back to Culture Signature!",
      error: "Invalid email or password",
    },
    signup: {
      title: "Join Our Community",
      description: "Create your account for exclusive collection updates.",
      submit: "Create account",
      success: "Welcome to the Culture Signature!",
      error: "Something went wrong",
      autoLoginError: "Account created, but there was an error signing you in. Please login manually.",
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your name",
    },
    forgotPassword: {
      title: "Reset Password",
      description: "Enter your email to receive a reset link.",
      submit: "Send Reset Link",
      backToLogin: "Back to Sign In",
    },
    common: {
      email: "Email",
      emailPlaceholder: "name@example.com",
      password: "Password",
      processing: "Processing...",
    }
  },
  nav: {
    account: {
      adminPanel: "Admin Panel",
      myAccount: "My Account",
      signOut: "Sign Out",
      signOutConfirm: "Are you sure you want to end your current session?",
      signOutSuccess: "Successfully signed out",
      label: "Account",
      menuLabel: "Account menu",
      signIn: "Sign In",
    },
    wishlist: "Wishlist",
    bag: "Shopping bag",
  },
  cart: {
    page: {
      title: "Shopping Bag",
      description: "Review your selection of artisanal masterpieces.",
      emptyTitle: "Your bag is empty",
      emptyDescription: "Discover our latest collections and find the piece that speaks to your legacy.",
      browseCollection: "Browse Collection",
      selection: "Product Selection ({count})",
      continueShopping: "Continue Shopping",
      moveToWishlist: "Move all to Wishlist",
    },
    summary: {
      title: "Order Summary",
      reviewTitle: "Order Review",
      qty: "Qty: {count}",
      subtotal: "Value (excl. GST)",
      shipping: "Shipping",
      shippingComplimentary: "Complimentary",
      estimatedTax: "Estimated GST (18%)",
      total: "Total Amount",
      finalTotal: "Final Total",
      discount: "Discount",
      promotionalCode: "Promotional Privilege",
      codePlaceholder: "ENTER CODE",
      apply: "Apply",
      proceedToCheckout: "Proceed to Checkout",
      finalizeAcquisition: "Finalize Acquisition",
      adminPreview: {
        title: "Admin Preview Mode",
        description: "Transactional features are disabled for administrative accounts."
      },
      footerNote: "Complimentary shipping above ₹{threshold}. Securely processed via Stripe.",
      footerNoteCheckout: "By finalizing, you agree to our Terms of Acquisition & Service.",
      badges: {
        expressDelivery: "White Glove Delivery",
        securePayment: "Authenticity Guaranteed"
      },
      messages: {
        invalidCode: "Please enter a valid promotional code.",
        codeApplied: "Promotional code {code} applied!",
        invalidOrExpiredCode: "Invalid or expired promotional code.",
        completeShipping: "Please complete your shipping information.",
        orderSuccess: "Order finalized successfully!",
        orderError: "Something went wrong while finalizing your order."
      }
    },
    checkout: {
      shipping: {
        title: "Shipping Information",
        subtitle: "Where should we deliver your masterpiece?",
        useSavedAddress: "Use Saved Address",
        curatedAddresses: "Your Curated Addresses",
        default: "DEFAULT",
        firstName: "First Name",
        lastName: "Last Name",
        streetAddress: "Street Address",
        city: "City",
        state: "State / Province",
        zipCode: "ZIP / Postal Code",
        phone: "Phone Number (For Delivery Updates)",
        billingSame: "Billing address is same as shipping",
        addressApplied: "Address applied to form",
        placeholders: {
          firstName: "John",
          lastName: "Doe",
          street: "123 Luxury Lane",
          city: "New York",
          state: "NY",
          zip: "10001",
          phone: "+1 212 555 0123",
        }
      },
      success: {
        title: "Acquisition Confirmed",
        description: "Your order has been received and added to our artisanal creation queue.",
        orderReference: "Order Reference",
        emailNote: "A confirmation email with your order details and estimated craftsmanship timeline has been sent to your registered address.",
        trackOrder: "Track Order",
        continueExploring: "Continue Exploring",
        pageTitle: "Thank You",
        pageSubtitle: "The beginning of something beautiful.",
        breadcrumb: "Success",
      }
    },
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
      subtitle: "Freshly Crafted",
      description: "The latest masterpieces to join the Culture Signature house.",
      empty: "New masterpieces are being curated as we speak."
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
  },
  shop: {
    title: "The Collection",
    subtitle: "Collections",
    description: "Explore our curated selection of handcrafted jewels, bags, and home decor that celebrate Indian heritage.",
    categories: "Categories",
    showing: "Showing {count} pieces",
    noMatches: "No matches found in the current collection.",
    clearFilters: "Clear all filters",
    loadError: "Could not load the collection.",
    product: {
      outOfStock: "Out of Stock",
      soldOut: "Sold Out",
      new: "New",
      off: "OFF",
      addToCart: "Add to Cart",
      unavailable: "Unavailable",
      quickView: "Quick View",
      removedFromWishlist: "removed from wishlist",
      defaultCollection: "Collection",
      viewCollection: "View Collection",
    },
    footer: {
      brand: {
        description: "Welcome to Culture Signature, where elegance and functionality intertwine seamlessly.",
        rights: "All Rights Reserved.",
      },
      sections: {
        explore: {
          title: "Explore",
          home: "Home",
          about: "About Us",
          contact: "Contact Us",
          faq: "FAQ",
        },
        legal: {
          title: "Legal",
          privacy: "Privacy Policy",
          refund: "Return & Refund Policy",
          shipping: "Shipping Policy",
          terms: "Terms & Conditions",
        }
      }
    }
  }
};

export type Translations = typeof en;
