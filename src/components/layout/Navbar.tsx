import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

export const Navbar: React.FC = () => {
  return (
    <div className="bg-background border-b border-border">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="font-bold text-2xl">
            Valuation MVP
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">
              <Link to="/about" className="text-foreground/80 hover:text-foreground">
                About
              </Link>
            </Button>

            <Button variant="ghost">
              <Link to="/vin-lookup" className="text-foreground/80 hover:text-foreground">
                VIN Lookup
              </Link>
            </Button>

            <Button>
              <Link to="/premium-valuation" className="text-background hover:text-background/80">
                Get Premium Report
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
