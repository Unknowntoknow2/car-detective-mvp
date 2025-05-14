
// Mock data for subscription components

export const currentPlanFeatures = [
  "Up to 100 vehicle uploads",
  "Advanced analytics dashboard",
  "Priority customer support",
  "Bulk import functionality",
  "Access to premium leads",
  "Custom dealership profile"
];

export const mockPaymentMethods = [
  {
    id: "card_123456",
    brand: "Visa",
    last4: "4242",
    expMonth: 12,
    expYear: 25,
    isDefault: true
  },
  {
    id: "card_789012",
    brand: "Mastercard",
    last4: "8888",
    expMonth: 6,
    expYear: 26,
    isDefault: false
  }
];

export const mockInvoices = [
  {
    id: "INV-001",
    date: "Nov 1, 2025",
    amount: 29.99,
    status: "paid"
  },
  {
    id: "INV-002",
    date: "Oct 1, 2025",
    amount: 29.99,
    status: "paid"
  },
  {
    id: "INV-003",
    date: "Sep 1, 2025",
    amount: 29.99,
    status: "paid"
  },
  {
    id: "INV-004",
    date: "Aug 1, 2025",
    amount: 19.99,
    status: "paid"
  },
  {
    id: "INV-005",
    date: "Dec 1, 2025",
    amount: 29.99,
    status: "pending"
  }
];

export const availablePlans = [
  {
    id: "free",
    name: "Free",
    description: "Basic features for small dealers",
    price: 0,
    features: [
      "Up to 5 vehicle uploads",
      "Basic dealership profile",
      "Standard support",
      "Community forums access"
    ],
    popular: false
  },
  {
    id: "basic",
    name: "Basic",
    description: "Essential tools for growing dealers",
    price: 19.99,
    features: [
      "Up to 25 vehicle uploads",
      "Enhanced dealership profile",
      "Email support within 24 hours",
      "Basic analytics dashboard",
      "Customer inquiry forwarding"
    ],
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    description: "Advanced features for established dealers",
    price: 29.99,
    features: [
      "Up to 100 vehicle uploads",
      "Featured dealer status",
      "Priority support",
      "Advanced analytics dashboard",
      "Bulk import functionality",
      "Access to premium leads"
    ],
    popular: true,
    saving: 60
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Complete solution for large dealerships",
    price: 99.99,
    features: [
      "Unlimited vehicle uploads",
      "Dedicated account manager",
      "Custom integrations",
      "White-label reports",
      "API access",
      "Multi-user accounts",
      "Advanced market insights"
    ],
    popular: false,
    saving: 200
  }
];
