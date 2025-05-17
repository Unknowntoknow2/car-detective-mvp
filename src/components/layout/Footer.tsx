
import React from 'react';
import { CDFooter } from '@/components/ui-kit/CDFooter';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const sections = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "Free Valuation", href: "/free-valuation" },
        { label: "Premium Reports", href: "/premium" },
        { label: "My Valuations", href: "/my-valuations" },
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "VIN Lookup", href: "/vin-lookup" },
        { label: "Contact Us", href: "/contact" },
        { label: "About", href: "/about" },
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ]
    }
  ];

  return (
    <CDFooter
      sections={sections}
      copyright={<>&copy; {new Date().getFullYear()} Car Detective. All rights reserved.</>}
      logo={
        <div className="font-semibold text-lg mb-4">Car Detective</div>
      }
    />
  );
};

export default Footer;
