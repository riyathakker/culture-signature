export const en = {
  footer: {
    sections: {
      legal: {
        title: "Legal",
      }
    }
  },
  admin: {
    sidebar: {
      overview: "Overview",
      products: "Products",
      orders: "Orders",
      customers: "Customers",
      discounts: "Discounts",
      categories: "Categories",
      content: "Content",
      home: "Home",
    },
    discounts: {
      title: "Discount & Offers",
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
        title: "Deactivate Discount",
        description: "Are you sure you want to revoke the exclusive offer \"{code}\"? This action will prevent patrons from utilizing this coupon code."
      },
      dialog: {
        titleCreate: "Create New Discount",
        titleEdit: "Modify Discount",
        descCreate: "Design an exclusive offer for your most valued patrons.",
        descEdit: "Refine the terms of this exclusive offer.",
        labels: {
          code: "Coupon Code",
          type: "Type",
          value: "Value",
          usageLimit: "Usage Limit",
          expiryDate: "Expiry Date",
        },
        buttons: {
          create: "Curate Offer",
          edit: "Update Offer"
        },
        messages: {
          createSuccess: "Discount created successfully.",
          updateSuccess: "Discount updated successfully.",
        }
      }
    },
    categories: {
      title: "Categories Clusters",
      description: "Organize your catalog into curated collections.",
      newCategory: "New Category",
      searchPlaceholder: "Search categories...",
      table: {
        collection: "Collection",
        products: "Products",
        status: "Status"
      },
      empty: "No collections match your search.",
      messages: {
        deleteSuccess: "Collection removed successfully",
        deleteError: "Failed to delete collection",
        archiveSuccess: "Collection archived successfully",
        activateSuccess: "Collection activated successfully",
        statusError: "Failed to change collection status",
      },
      status: {
        active: "Active",
        archived: "Archived",
      },
      actions: {
        activate: "Activate",
        archive: "Archive",
      },
      delete: {
        title: "Remove Collection",
        description: "Are you sure you want to remove the collection \"{name}\"? This will soft-delete the category.",
      },
      dialog: {
        titleCreate: "Initiate Collection",
        titleEdit: "Refine Collection",
        descCreate: "Establish a new category for your artisanal masterpieces.",
        descEdit: "Update the thematic details of this curated collection.",
        labels: {
          name: "Collection Name",
          image: "Collection Image",
          status: "Status",
        },
        placeholders: {
          name: "e.g., Heritage Gold",
        },
        validation: {
          nameRequired: "Name is required",
        },
        status: {
          active: "Active",
          archived: "Archived",
        },
        buttons: {
          create: "Establish Collection",
          edit: "Update Collection"
        },
        messages: {
          createSuccess: "Collection established successfully.",
          updateSuccess: "Collection updated successfully.",
        }
      }
    },
    common: {
      cancel: "Cancel",
      delete: "Delete",
      error: "Something went wrong",
    },
    content: {
      title: "Exhibitions & Shoots",
      description: "Manage pop-ups, photo shoots, and events.",
      addButton: "Add Exhibition",
      empty: "No exhibitions yet — add your first event",
      messages: {
        deleted: "Exhibition deleted",
        deleteError: "Failed to delete",
      },
      dialog: {
        titleCreate: "Add Exhibition / Shoot",
        titleEdit: "Edit Exhibition / Shoot",
        desc: "Add exhibitions, shoots, or pop-ups. Location opens in Google Maps.",
        labels: {
          title: "Title",
          description: "Description",
          location: "Location",
          locationHint: "(opens in Google Maps)",
          startDate: "Start Date",
          endDate: "End Date",
          startTime: "Start Time",
          endTime: "End Time",
          status: "Status",
          images: "Images",
        },
        placeholders: {
          title: "e.g., Summer Lookbook Shoot — Jaipur",
          description: "Tell people about this event...",
          location: "e.g., Jaipur, Rajasthan or full address",
        },
        status: {
          upcoming: "Upcoming",
          ongoing: "Ongoing",
          past: "Past",
        },
        buttons: {
          save: "Save Changes",
          add: "Add Exhibition",
        },
        messages: {
          updated: "Exhibition updated",
          added: "Exhibition added",
          error: "Something went wrong",
        },
      },
      delete: {
        title: "Delete Exhibition",
        description: "Are you sure you want to delete \"{title}\"?",
        confirm: "Delete",
        cancel: "Cancel",
      },
    },
    products: {
      title: "Artisanal Catalog",
      description: "Curate and manage your collection of timeless masterpieces.",
      newProduct: "New Product",
      bulkUpload: "Bulk Upload",
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
      },
      messages: {
        updateSuccess: "{field} updated",
        updateError: "Failed to update",
        featuredSuccess: "Marked as Featured",
        unfeaturedSuccess: "Removed from Featured",
      },
      bulk: {
        title: "Bulk Upload",
        applyAll: "Apply Same Value to All Rows",
        applyBtn: "Apply to All",
        labels: {
          name: "Name",
          category: "Category",
          price: "Price (₹)",
          discount: "Discount (₹)",
          stock: "Stock",
          featured: "Featured",
          description: "Description (optional)",
          categoryRequired: "Category *",
          priceRequired: "Price (₹) *",
          discountShort: "Disc (₹)",
          poolImageAssign: "Click to assign — max 4 per product",
        },
        placeholders: {
          sameForAll: "Same for all",
          productName: "Product name *",
          select: "Select",
        },
        imagePool: {
          title: "Image Pool",
          imageCount: "image",
          imagesCount: "images",
          description: "Upload all your product images here at once, then assign them to individual products below.",
          dropzoneActive: "Drop images here",
          dropzoneInactive: "Click or drag to upload multiple images",
          dropzoneNote: "JPEG, PNG, WebP — no limit",
          tabPool: "From Pool",
          tabDirect: "Upload Direct",
          emptyPool: "No images in pool yet. Upload images to the pool above, then select them here.",
        },
        buttons: {
          addAnother: "Add Another Product",
          uploading: "Uploading...",
          upload: "Upload",
        },
        stats: {
          published: "published",
          failed: "failed",
        },
        toast: {
          applySuccess: "Applied to all pending rows.",
          missingFields: "Fill in Name, Price, and Category for at least one product.",
          uploadSuccessSingle: "1 product published successfully.",
          uploadSuccessPlural: "{count} products published successfully.",
          uploadFailSingle: "1 product failed. Review errors below.",
          uploadFailPlural: "{count} products failed. Review errors below.",
          imagesAddedSingle: "1 image added to pool.",
          imagesAddedPlural: "{count} images added to pool.",
          imagesUploadFailed: "Some images failed to upload.",
          maxImages: "Max 4 images per product.",
          failed: "Failed",
        }
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
  account: {
    layout: {
      heading: "My Account",
      description: "Manage your account, orders and preferences.",
    },
    orders: {
      heading: "Order History",
      subtitle: "Your order history.",
      emptyDescription: "No orders yet. Start shopping!",
      orderDetails: "Order Details",
      orderDetailsSubtitle: "Your order details.",
      allOrders: "All Orders",
      yourItems: "Your Items",
      priceBreakdown: "Price Breakdown",
      shippingAddress: "Shipping Address",
      shippingFree: "Free",
    },
    wishlist: {
      heading: "Wishlist",
      subtitle: "Items you have saved.",
      emptyDescription: "Your saved items will appear here.",
    },
    addresses: {
      heading: "Saved Addresses",
      subtitle: "Manage your delivery and billing addresses.",
      emptyDescription: "Add and manage your delivery addresses.",
    },
    settings: {
      heading: "Account Settings",
      subtitle: "Manage your preferences and account security.",
      deleteWarning: "This will permanently delete your account and order history.",
    },
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
    links: {
      home: "Home",
      newArrivals: "New Arrivals",
      collections: "Collections",
      categories: "Categories",
      aboutUs: "About Us",
      contactUs: "Contact Us",
    }
  },
  cart: {
    page: {
      title: "Shopping Bag",
      description: "Review your items before checkout.",
      checkoutDescription: "Complete your order details below.",
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
      shippingComplimentary: "Free",
      estimatedTax: "Estimated GST (18%)",
      total: "Total Amount",
      finalTotal: "Final Total",
      promotionalCode: "Promotional Discount",
      codePlaceholder: "ENTER CODE",
      apply: "Apply",
      proceedToCheckout: "Proceed to Checkout",
      finalizeAcquisition: "Place Order",
      adminPreview: {
        title: "Admin Preview Mode",
        description: "Transactional features are disabled for administrative accounts."
      },
      footerNote: "Free shipping above ₹{threshold}. Securely processed via Stripe.",
      footerNoteCheckout: "By placing your order, you agree to our Terms & Conditions.",
      badges: {
        expressDelivery: "White Glove Delivery",
        securePayment: "Authenticity Guaranteed"
      },
      messages: {
        invalidCode: "Please enter a valid promotional code.",
        codeApplied: "Promotional code {code} applied!",
        invalidOrExpiredCode: "Invalid or expired promotional code.",
        completeShipping: "Please complete your shipping information.",
        orderError: "Something went wrong while finalizing your order."
      }
    },
    checkout: {
      shipping: {
        title: "Shipping Information",
        subtitle: "Where should we deliver your order?",
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
        title: "Order Confirmed",
        description: "Your order has been received and is being processed.",
        orderReference: "Order Reference",
        emailNote: "A confirmation email with your order details has been sent to your registered email address.",
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
      title: "The Categories",
      subtitle: "Curated Heritage",
      pieces: "Items"
    },
    featured: {
      title: "Iconic Items",
      subtitle: "Handcrafted Legacy",
      viewCollection: "View Collection"
    },
    newArrivals: {
      title: "New Arrivals",
      subtitle: "Freshly Crafted",
      description: "The latest items added to our collection.",
      empty: "New items coming soon.",
      viewMore: "View More"
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
          question: "How do I care for my jewelry?",
          answer: "Store your items in the provided velvet pouches. Avoid direct contact with perfumes and harsh chemicals. Gently wipe with a soft cloth after use."
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes, we ship globally. Free shipping is available on orders above ₹5,000."
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
    showing: "Showing {count} items",
    noMatches: "No matches found in the current collection.",
    clearFilters: "Clear all filters",
    product: {
      outOfStock: "Out of Stock",
      off: "OFF",
      addToCart: "Add to Cart",
      unavailable: "Unavailable",
      quickView: "Quick View",
      removedFromWishlist: "removed from wishlist",
      defaultCollection: "Collection",
      viewCollection: "View Collection",
      details: {
        loadError: "Could not load product details.",
        notFound: "Product not found.",
        relatedTitle: "Complete the Look",
        relatedSubtitle: "You May Also Like",
        specs: {
          category: "Category",
          stock: "Stock",
          inStock: "In Stock",
          outOfStock: "Out of Stock"
        },
        shippingNote: "Free worldwide shipping on all orders over ₹10,000.",
        addToCollection: "Add to Cart",
        reviews: {
          verifiedBuyer: "Verified Buyer",
          purchaseToReview: "Purchase this product to leave a review",
          signInToReview: "Sign in and purchase to leave a review",
          shareThoughts: "Share your thoughts on this product and help other buyers.",
        },
        buyNow: "Buy Now",
        premiumShipping: "Premium Shipping",
        lifetimeWarranty: "Lifetime Warranty",
        tabs: {
          story: "The Story",
          specs: "Specifications",
          shipping: "Shipping & Returns",
          shippingTitle: "Premium Shipping",
          shippingDesc: "Every Culture Signature piece is delivered in our signature lacquered box, wrapped in silk ribbon, and accompanied by a certificate of authenticity.",
          shippingList: [
            "Insured worldwide express delivery (3-5 business days).",
            "Free store pickup available in selected cities.",
            "30-day extended returns for all standard collection items."
          ]
        }
      }
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
  },
  collections: {
    title: "Categories clusters",
    subtitle: "Categories",
    description: "Curated anthologies of heritage and style.",
    empty: "Our curations are being prepared for your view.",
  },
  about: {
    breadcrumb: "About Us",
    heading: "Crafting Legacy Since 2013",
    description: "Where elegance and functionality intertwine to create timeless artisanal masterpieces.",
    visionary: {
      header: "The Visionary",
      name: "Jalpa Thakkar",
      quote: "Culture Signature was born from a desire to celebrate the unique essence of every woman while honoring the rich heritage of Indian artistry.",
      story: "Founded in 2013, Culture Signature is more than a brand; it's a movement. We specialize in handcrafted jewelry and bags that serve as a testament to the meticulous skill of Indian artisans."
    },
    cards: {
      vision: {
        title: "Our Vision",
        description: "To globally delight our clients with uniquely crafted jewelry, anticipating and fulfilling their diverse needs and cultural preferences."
      },
      mission: {
        title: "Our Mission",
        description: "Empowering women, celebrating their uniqueness, and inspiring them to embrace their true selves while preserving Indian heritage."
      },
      legacy: {
        title: "Our Legacy",
        description: "Pursuing perfection in every handcrafted piece, ensuring that every Culture Signature creation is a masterpiece of its own."
      }
    },
    pillars: {
      subtitle: "Our Core Pillars",
      title: "The Values We Live By",
      list: [
        { title: "Creative Designs", desc: "Unique and enchanting jewelry that captures the imagination." },
        { title: "Unwavering Integrity", desc: "Upholding transparency and ethical practices in every transaction." },
        { title: "Master Perfection", desc: "Pursuing excellence in every handcrafted detail." },
        { title: "Eco Responsibility", desc: "Committed to sustainability and ethical sourcing of materials." },
        { title: "Respectful Bonds", desc: "Fostering positive connections with our artisans and clients." },
        { title: "Global Delight", desc: "Anticipating desires and fulfilling cultural preferences worldwide." }
      ]
    }
  },
  contact: {
    breadcrumb: "Contact Us",
    heading: "Get in Touch",
    description: "Our concierge team is at your service for inquiries, bespoke orders, and artisanal consultations.",
    channels: {
      header: "Inquiry Channels",
      call: "Call Us",
      email: "Email Us",
      visit: "Visit Boutique",
      hours: "Boutique Hours",
      address: "Ground floor Sanskruti app,\nRam Chowk, Ghod Dod Road,\nSurat, Gujarat.",
      boutiqueHours: "Mon - Sat: 11:00 AM - 8:00 PM",
      sundayNote: "Sundays by appointment only"
    },
    social: {
      header: "Social Presence"
    },
    form: {
      title: "Send a Message",
      subtitle: "We typically respond within 24 business hours.",
      fullName: "Full Name",
      email: "Email Address",
      subject: "Subject",
      message: "Message",
      placeholders: {
        fullName: "John Doe",
        email: "john@example.com",
        subject: "Inquiry about artisanal jewelry",
        message: "How can we assist you today?"
      },
      submit: "Send Inquiry"
    }
  },
  legal: {
    shipping: {
      breadcrumb: "Shipping Policy",
      title: "Shipping Policy",
      subtitle: "Delivering excellence to your doorstep with the utmost care and security.",
      badges: {
        discrete: { title: "Discrete Delivery", desc: "Signature packaging that ensures privacy and elegance." },
        insured: { title: "Fully Insured", desc: "Every shipment is 100% insured until it reaches your hands." },
        global: { title: "Global Reach", desc: "Partnering with premium couriers for worldwide delivery." }
      },
      sections: {
        processing: { title: "1. Processing Times", content: "As our pieces are often finished to order, please allow 2-4 business days for processing. Custom masterpieces may require extended timeframes, which will be communicated during the design phase." },
        methods: { title: "2. Shipping Methods & Rates", table: { region: "Region", courier: "Courier", rate: "Rate", domestic: "India (Domestic)", domesticCourier: "Premium Express", complimentary: "Complimentary", international: "International", internationalCourier: "DHL/FedEx Priority" } },
        signature: { title: "3. Signature Requirement", content: "To ensure the security of your high-value purchase, all Culture Signature shipments require an adult signature upon delivery. We do not ship to P.O. boxes." },
        customs: { title: "4. International Customs", content: "For international orders, the recipient is responsible for any local customs duties or import taxes. These are not included in the shipping rate and will be collected by the courier at the time of delivery." }
      }
    },
    refund: {
      breadcrumb: "Return & Refund Policy",
      title: "Return & Refund",
      subtitle: "Ensuring your complete satisfaction with every artisanal acquisition.",
      sections: {
        commitment: { title: "1. Our Commitment", content: "At Culture Signature, we stand by the exceptional quality of our craftsmanship. If a piece does not meet your expectations, we offer a refined return process." },
        eligibility: { title: "2. Eligibility for Returns", intro: "To be eligible for a return, the following conditions must be met:", items: ["The item must be returned within 14 days of the delivery date.", "Items must be in their original, pristine condition, unworn and unaltered.", "All original packaging, certificates of authenticity, and security tags must be intact."] },
        nonReturnable: { title: "3. Non-Returnable Items", content: "Please note that custom-designed masterpieces, personalized engravings, and intimate wear are final sale and cannot be returned or exchanged." },
        process: { title: "4. Refund Process", intro: "Once your return is received and inspected by our master artisans:", items: ["We will notify you of the approval or rejection of your refund.", "Approved refunds will be processed to the original method of payment within 7-10 business days.", "Please note that shipping costs are non-refundable."] },
        assistance: { title: "Need Assistance?", content: "Our concierge team is available to assist you with any return inquiries at", email: "concierge@culturesignature.com" }
      }
    },
    privacy: {
      breadcrumb: "Privacy Policy",
      title: "Privacy Policy",
      subtitle: "Your trust is our most precious masterpiece. Learn how we protect your information.",
      sections: {
        collect: { title: "1. Information We Collect", content: "At Culture Signature, we collect information that helps us provide a personalized and seamless luxury experience.", items: ["Personal Identification: Name, email address, phone number, and shipping/billing address.", "Transaction Details: Purchase history and payment preferences (though we never store full credit card numbers).", "Digital Footprint: IP address, browser type, and interaction data to improve our boutique experience online."] },
        use: { title: "2. How We Use Your Data", intro: "Your data is utilized solely to enhance your journey with us. This includes:", items: ["Processing and fulfilling your artisanal orders.", "Providing exclusive \"Inner Circle\" updates and invitations.", "Customizing product recommendations based on your unique style.", "Ensuring the security and integrity of our platform."] },
        protection: { title: "3. Data Protection", content: "We employ state-of-the-art encryption and security protocols to ensure your data remains as secure as the gems in our vault. We never sell your personal information to third parties." },
        contact: { title: "4. Contact Our Privacy Officer", content: "If you have any questions regarding your privacy or wish to exercise your data rights, please reach out to us at", email: "privacy@culturesignature.com" }
      }
    },
    terms: {
      breadcrumb: "Terms of Service",
      title: "Terms & Conditions",
      subtitle: "Defining the standards of our relationship and your journey with Culture Signature.",
      lastUpdated: "Last Updated: May 2026",
      sections: {
        agreement: { title: "1. Agreement to Terms", content: "By accessing or using the Culture Signature website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our boutique services." },
        intellectualProperty: { title: "2. Artisanal Products & Intellectual Property", content: "All designs, masterpieces, images, and content displayed on this platform are the exclusive intellectual property of Culture Signature.", note: "Any unauthorized reproduction, modification, or distribution of our designs or content is strictly prohibited and protected by international copyright laws." },
        accounts: { title: "3. User Accounts", content: "Members of the \"Inner Circle\" are responsible for maintaining the confidentiality of their account credentials. You agree to notify us immediately of any unauthorized use of your account." },
        pricing: { title: "4. Pricing & Availability", content: "While we strive for absolute accuracy, pricing or availability errors may occur. We reserve the right to correct any errors and cancel orders if necessary.", note: "Prices are subject to change based on the fluctuating market value of precious metals and gemstones." },
        liability: { title: "5. Limitation of Liability", content: "Culture Signature shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our liability is limited to the purchase price of the item in question." },
        jurisdiction: "These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Mumbai."
      }
    }
  }
};

export type Translations = typeof en;
