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
          location: "Google Maps Link",
          locationHint: "(name & city are read from the link)",
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
          location: "Paste a Google Maps link",
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
      eyebrow: "Welcome back",
      editorial: "Welcome back to\nthe world of fine luxury.",
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
      eyebrow: "New member",
      editorial: "Begin your journey\ninto timeless elegance.",
      hasAccount: "Already have an account?",
    },
    forgotPassword: {
      title: "Reset Password",
      description: "Enter your email to receive a reset link.",
      submit: "Send Reset Link",
      backToLogin: "Back to Sign In",
      eyebrow: "Account recovery",
    },
    common: {
      email: "Email",
      emailPlaceholder: "name@example.com",
      password: "Password",
      processing: "Processing...",
      back: "Back",
      or: "or",
      brandTagline: "Culture Signature by Jalpa Thakkar",
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
      emptyTitle: "No orders yet",
      notFound: "Order not found",
      backToOrders: "Back to Orders",
      orderId: "Order ID",
      placedOn: "Placed On",
      itemsLabel: "Items",
      itemSingular: "item",
      itemPlural: "items",
      qty: "Qty",
      yourReview: "Your review",
      subtotal: "Subtotal",
      discount: "Discount",
      gst: "GST (18%)",
      shipping: "Shipping",
      total: "Total",
      orderItems: "Order Items",
      hide: "Hide",
      details: "Details",
      view: "View",
      table: {
        id: "Order ID",
        date: "Date",
        status: "Status",
        total: "Total",
      },
      status: {
        pending: "Pending",
        paid: "Paid",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
      },
      tracker: {
        placed: "Order Placed",
        paid: "Payment Confirmed",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Order Cancelled",
        cancelledDesc: "This order has been cancelled. If you have any questions, please contact support.",
        current: "Current",
      },
    },
    wishlist: {
      heading: "Wishlist",
      subtitle: "Items you have saved.",
      emptyDescription: "Your saved items will appear here.",
      emptyTitle: "Your wishlist is empty",
      exploreCollection: "Explore Collection",
    },
    addresses: {
      heading: "Saved Addresses",
      subtitle: "Manage your delivery and billing addresses.",
      emptyDescription: "Add and manage your delivery addresses.",
      emptyTitle: "No saved addresses",
      addNew: "Add New",
      addTitle: "Add New Address",
      editTitle: "Edit Address",
      defaultShipping: "Default Shipping",
      setDefault: "Set as Default",
      removeTitle: "Remove Address",
      removeDescription: "Are you sure you want to remove \"{street}\" from your shipping collection?",
      removeConfirm: "Yes, Remove",
      messages: {
        deleted: "Address deleted",
        defaultUpdated: "Default address updated",
        updated: "Address updated",
        added: "Address added",
      },
      form: {
        firstName: "First Name",
        lastName: "Last Name",
        street: "Street Address",
        phone: "Phone Number",
        setDefaultLabel: "Set as default address",
        save: "Save Address",
        update: "Update Address",
        placeholders: {
          firstName: "John",
          lastName: "Doe",
          street: "123 Luxury Lane",
          phone: "+91 9876543210",
        },
        validation: {
          firstName: "First name is required",
          lastName: "Last name is required",
          street: "Street is required",
          country: "Country is required",
          state: "State is required",
          city: "City is required",
          zipCode: "Zip code is required",
          phone: "Phone number is required",
        },
      },
    },
    settings: {
      heading: "Account Settings",
      subtitle: "Manage your preferences and account security.",
      deleteWarning: "This will permanently delete your account and order history.",
      personalInfo: "Personal Information",
      fullName: "Full Name",
      email: "Email Address",
      mobileNumber: "Mobile Number",
      mobilePlaceholder: "+91 99999 99999",
      dangerZone: "Danger Zone",
      deactivateAccount: "Deactivate Account",
      permanentlyDelete: "Permanently Delete Account",
      deleteDialogTitle: "Farewell, Member?",
      deleteDialogDescription: "Are you absolutely sure? This action is permanent and will delete your entire account",
      deleteConfirm: "Delete Account",
      messages: {
        updateSuccess: "Profile updated successfully",
        updateError: "Something went wrong",
        deleteSuccess: "Account deleted successfully. Farewell.",
        deleteError: "Failed to delete account",
      },
    },
    common: {
      error: "Something went wrong",
      viewAll: "View All",
      discoverCollection: "Discover Collection",
      saveChanges: "Save Changes",
    },
    sidebar: {
      overview: "Profile Overview",
      wishlist: "My Wishlist",
    },
    overview: {
      totalOrders: "Total Orders",
      wishlistItems: "Wishlist Items",
      recentSelection: "Recent Selection",
      seeAllOrders: "See All Orders",
      order: "Order",
      placed: "Placed",
      ordersInCollectionOne: "You have {count} order in your collection.",
      ordersInCollectionMany: "You have {count} orders in your collection.",
      startShopping: "Start shopping to place your first order.",
    },
    mobileHeader: {
      admin: "Admin",
      userAlt: "User",
    },
    review: {
      button: "Review",
      title: "Write a Review",
      subtitle: "Sharing your experience with the {name}.",
      rating: "Your Rating",
      thoughts: "Your Thoughts",
      placeholder: "What did you love about this piece?",
      submit: "Submit Review",
      submitting: "Submitting...",
      success: "Review submitted successfully",
      error: "Failed to submit review",
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
    goToBag: "Go to shopping bag",
    item: {
      noImage: "No Image",
      each: "each",
    },
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
      movedToWishlist: "All items moved to wishlist",
    },
    summary: {
      remove: "Remove",
      signInToCheckout: "Sign In to Checkout",
      processing: {
        verifyingTitle: "Confirming Payment",
        recordingTitle: "Securing Your Order",
        verifyingDesc: "Verifying your payment with our secure gateway. Please do not close this window.",
        recordingDesc: "Recording your order and preparing confirmation. Almost there.",
      },
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
        orderError: "Something went wrong while finalizing your order.",
        paymentOrderError: "Failed to create payment order",
        paymentFailed: "Payment failed or was cancelled.",
        verificationFailed: "Payment verification failed. Please contact support.",
        recordOrderError: "Failed to record your order. Please contact support."
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
      imageAlt: "Luxury Jewelry",
      cta: "Explore the Collection",
      ctaSecondary: "Our Story"
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
    exhibitions: {
      title: "Exhibitions & Shoots",
      subtitle: "Where to Find Us",
      viewLocation: "View location on map",
      imageAria: "Image {n}",
      status: {
        ongoing: "Ongoing",
        upcoming: "Upcoming",
        past: "Past"
      }
    },
    limitedDrops: {
      title: "Limited Drops",
      subtitle: "Only a Few Left",
      stockLeft: "{count} left"
    },
    trust: {
      delivery: {
        title: "Fast Delivery",
        desc: "Free shipping over ₹5,000"
      },
      quality: {
        title: "Quality Assured",
        desc: "Handcrafted, authentic pieces"
      },
      secure: {
        title: "Secure Payments",
        desc: "Encrypted, protected checkout"
      },
      support: {
        title: "Here to Help",
        desc: "Dedicated customer care"
      }
    },
    celebSpotting: {
      title: "Celeb Spotting",
      subtitle: "Spotted in Culture Signature",
      imageAlt: "Spotted in Culture Signature",
      fullscreenAlt: "Fullscreen view"
    },
    testimonials: {
      title: "Voices of Elegance",
      subtitle: "From Our Patrons",
      anonymous: "Anonymous"
    },
    faq: {
      title: "Common Inquiries",
      subtitle: "Your Questions Answered",
      breadcrumb: "FAQ",
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
    resultsFor: 'Results for "{query}"',
    itemsFound: "{count} items found",
    loadCollectionError: "Could not load the collection.",
    categoryEmpty: "No products found in this category yet.",
    exploreAll: "Explore All Collections",
    filter: {
      title: "Filter By",
      availability: "Availability",
      inStock: "In Stock Only",
      onSale: "On Sale",
      categories: "Categories",
      noCategories: "No categories found",
      priceRange: "Price Range",
      product: "Product",
      products: "Products",
      apply: "Apply Filters",
      clearAll: "Clear All Filters",
      filter: "Filter",
      selection: "Filter Selection",
    },
    sort: {
      label: "Sort By",
      newest: "Newest Arrivals",
      priceLow: "Price: Low to High",
      priceHigh: "Price: High to Low",
      popular: "Most Popular",
    },
    product: {
      outOfStock: "Out of Stock",
      off: "OFF",
      addToCart: "Add to Cart",
      unavailable: "Unavailable",
      quickView: "Quick View",
      removedFromWishlist: "removed from wishlist",
      defaultCollection: "Collection",
      viewCollection: "View Collection",
      recentlyViewed: "Recently Viewed",
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
        color: "Color",
        onlyLeft: "Only {count} left",
        soldOut: "Sold out",
        shareAria: "Share product",
        addToWishlist: "Add to wishlist",
        removeFromWishlist: "Remove from wishlist",
        notify: {
          success: "We'll notify you when this piece is back in stock.",
          notified: "You'll be notified",
          notifyMe: "Notify me when available",
        },
        pincode: {
          check: "Check delivery",
          summary: "{pin}: by {date}",
          placeholder: "Enter 6-digit pincode",
          checkBtn: "Check",
          available: "Delivery available",
          estimatedBy: "estimated by",
          businessDays: "({count} business days)",
          invalid: "Enter a valid 6-digit Indian pincode",
        },
        share: {
          text: "Check out {name} on Culture Signature",
          linkCopied: "Link copied to clipboard",
          copyFailed: "Failed to copy link",
          title: "Share this piece",
          copyAria: "Copy link",
          copied: "Copied!",
          copyLink: "Copy Link",
        },
        reviews: {
          verifiedBuyer: "Verified Buyer",
          purchaseToReview: "Purchase this product to leave a review",
          signInToReview: "Sign in and purchase to leave a review",
          shareThoughts: "Share your thoughts on this product and help other buyers.",
          title: "Customer Reviews",
          beFirst: "Be the First to Review",
          beFirstDesc: "Share your experience with this piece and help others discover its beauty.",
          basedOn: "Based on {count}",
          reviewSingular: "Review",
          reviewPlural: "Reviews",
          shareExperience: "Share your experience",
          customer: "Customer",
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
  common: {
    backToTop: "Back to top",
    close: "Close",
    previous: "Previous",
    next: "Next",
    viewFullscreen: "View {alt} fullscreen",
    addToWishlist: "Add to wishlist",
    decreaseQuantity: "Decrease quantity",
    increaseQuantity: "Increase quantity",
    cancel: "Cancel",
    continue: "Continue",
    location: {
      country: "Country",
      selectCountry: "Select country",
      state: "State",
      selectState: "Select state",
      enterState: "Enter state",
      city: "City",
      selectCity: "Select city",
      enterCity: "Enter city",
      zipCode: "Pin Code / Zip Code",
      autoFilled: "Auto-filled from city",
      enterZip: "Enter zip code",
    },
  },
  wishlist: {
    breadcrumb: "Your Wishlist",
    heading: "Wishlist",
    description: "Items you have saved to buy later.",
    emptyTitle: "Your wishlist is empty",
    emptyDescription: "Browse our collection and save your favorites here.",
    explore: "Explore Collection",
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
      submit: "Send Inquiry",
      sending: "Sending...",
      success: "Thank you — your inquiry has been received.",
      error: "Something went wrong. Please try again.",
      validation: "Please fill in your name, email and message."
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

/** A single FAQ entry, derived from the translations so the shape stays in sync. */
export type FaqItem = (typeof en)["home"]["faq"]["questions"][number];

/** A single "core pillar" entry on the About page, derived from the translations. */
export type PillarItem = (typeof en)["about"]["pillars"]["list"][number];
