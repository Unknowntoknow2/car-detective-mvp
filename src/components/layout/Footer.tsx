
import React from 'react';
import { DesignCard } from '../ui/design-system';
import { 
  MapPin, 
  Mail, 
  Phone, 
  ArrowRight, 
  Shield, 
  Check, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-16 bg-gradient-to-b from-surface to-surface-dark">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-display font-semibold text-text-primary">
              CarDetective
            </h2>
            <p className="text-text-secondary text-sm max-w-md">
              The most comprehensive vehicle valuation platform with advanced AI technology
              and CARFAX® integration for accurate, market-driven price estimates.
            </p>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-sm text-text-secondary">
                  123 Auto Blvd, Suite 400<br />
                  San Francisco, CA 94107
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:info@cardetective.com" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  info@cardetective.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:+18005551234" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  (800) 555-1234
                </a>
              </div>
            </div>
            
            <div className="flex space-x-4 pt-4">
              {[
                { icon: <Facebook className="h-4 w-4" />, name: 'Facebook' },
                { icon: <Twitter className="h-4 w-4" />, name: 'Twitter' },
                { icon: <Instagram className="h-4 w-4" />, name: 'Instagram' },
                { icon: <Linkedin className="h-4 w-4" />, name: 'LinkedIn' }
              ].map((social) => (
                <a 
                  key={social.name} 
                  href={`#${social.name.toLowerCase()}`} 
                  className="h-10 w-10 rounded-full flex items-center justify-center 
                  border border-border text-text-secondary hover:text-primary hover:border-primary 
                  transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-medium mb-6 text-text-primary">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'VIN Lookup', href: '/lookup/vin' },
                { label: 'Plate Lookup', href: '/lookup/plate' },
                { label: 'Manual Lookup', href: '/lookup/manual' },
                { label: 'Premium Valuation', href: '/premium' },
                { label: 'Contact Us', href: '#contact' }
              ].map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="group flex items-center text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal & Trust */}
          <div className="space-y-8">
            <div>
              <h3 className="font-medium mb-6 text-text-primary">Legal</h3>
              <ul className="space-y-3">
                {[
                  { label: 'Terms of Service', href: '#terms' },
                  { label: 'Privacy Policy', href: '#privacy' },
                  { label: 'Cookie Policy', href: '#cookies' },
                  { label: 'GDPR', href: '#gdpr' },
                  { label: 'Accessibility', href: '#accessibility' }
                ].map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-text-secondary hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <DesignCard
              variant="glass"
              padding="sm"
              className="bg-surface-dark/60 border-border-dark"
            >
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-text-primary">Verified & Secured</h4>
                  <p className="text-xs text-text-secondary mt-0.5">SSLv3 & 256-bit Encryption</p>
                </div>
              </div>
            </DesignCard>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border">
          <p className="text-center text-sm text-text-secondary md:text-left">
            &copy; {currentYear} CarDetective. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <DesignCard 
              variant="glass" 
              padding="sm" 
              className="bg-surface-dark/60 border-border"
            >
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <p className="text-xs text-text-secondary">
                  <span className="font-medium">US Vehicles Only</span>
                </p>
              </div>
            </DesignCard>
            
            <DesignCard 
              variant="glass" 
              padding="sm" 
              className="bg-surface-dark/60 border-border"
            >
              <p className="text-xs text-text-secondary">
                <span className="font-medium">CARFAX®</span> Certified Partner
              </p>
            </DesignCard>
          </div>
        </div>
      </div>
    </footer>
  );
}
