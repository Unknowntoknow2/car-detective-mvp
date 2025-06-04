<<<<<<< HEAD

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-muted py-6 text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Branding */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p className="font-semibold text-gray-800">Car Detective™</p>
          <p>Fair & Transparent Vehicle Valuations</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/valuation" className="hover:text-primary">Valuation</Link>
          <Link to="/premium" className="hover:text-primary">Premium</Link>
          <Link to="/auth" className="hover:text-primary">Sign In</Link>
          <Link to="/register" className="hover:text-primary">Sign Up</Link>
          <Link to="/privacy" className="hover:text-primary">Privacy</Link>
          <Link to="/terms" className="hover:text-primary">Terms</Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-muted-foreground mt-4">
        © {new Date().getFullYear()} Car Detective™. All rights reserved.
      </div>
    </footer>
=======
import React from "react";
import { CDFooter } from "@/components/ui-kit/CDFooter";
import { Link } from "react-router-dom";

export const Footer = () => {
  const sections = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "Free Valuation", href: "/free-valuation" },
        { label: "Premium Reports", href: "/premium" },
        { label: "My Valuations", href: "/my-valuations" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "VIN Lookup", href: "/vin-lookup" },
        { label: "Contact Us", href: "/contact" },
        { label: "About", href: "/about" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

  return (
    <CDFooter
      sections={sections}
      copyright={
        <>
          &copy; {new Date().getFullYear()} Car Detective. All rights reserved.
        </>
      }
      logo={<div className="font-semibold text-lg mb-4">Car Detective</div>}
    />
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
};

export default Footer;
