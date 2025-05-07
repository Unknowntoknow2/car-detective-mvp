
import React from "react";
import { CDNavbar } from "@/components/ui-kit/CDNavbar";
import { CDFooter } from "@/components/ui-kit/CDFooter";

// This is a feature-scoped layout - it doesn't touch the global app layout
// It can be used together with the global layout or as a standalone

type FeatureLayoutProps = {
  children: React.ReactNode;
};

export const ValuationHomepageLayout: React.FC<FeatureLayoutProps> = ({ children }) => {
  // Navigation items
  const navItems = [
    { label: "Home", href: "/", isActive: true },
    { label: "Valuation", href: "/valuation/start" },
    { label: "Premium", href: "/premium" },
    { label: "About", href: "/about" },
  ];

  // Footer sections
  const footerSections = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Car Valuation", href: "/valuation" },
        { label: "Premium Reports", href: "/premium" },
        { label: "Dealer Services", href: "/dealers" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Help Center", href: "/help" },
        { label: "FAQs", href: "/faqs" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <CDNavbar 
        logoText="Car Detective™"
        navItems={navItems}
        actions={
          <a href="/valuation/start">
            <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium">
              Get Valuation
            </button>
          </a>
        }
        sticky
        variant="solid"
      />
      
      <main className="flex-1">
        {children}
      </main>
      
      <CDFooter 
        sections={footerSections}
        copyright={<>© {new Date().getFullYear()} Car Detective™. All rights reserved.</>}
        variant="light"
        bordered
      />
    </div>
  );
};

export default ValuationHomepageLayout;
