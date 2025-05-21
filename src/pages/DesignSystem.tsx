import React, { useState } from 'react';
import { CDButton } from '@/components/ui-kit/CDButton';
import { CDCard, CDCardHeader, CDCardBody } from '@/components/ui-kit/CDCard';
import { CDTooltip } from '@/components/ui-kit/CDTooltip';
import { CDBadge } from '@/components/ui-kit/CDBadge';
import { Heading, HeadingXL, HeadingL, BodyM, BodyS, Caption } from '@/components/ui-kit/typography';
import { ValuationResult } from '@/modules/valuation-result/ValuationResult';
import { InfoIcon, AlertCircle, Check } from 'lucide-react';

const DesignSystem = () => {
  // Mock data for ValuationResult demo
  const mockValuationData = {
    make: 'Toyota',
    model: 'Camry',
    year: 2019,
    mileage: 42000,
    condition: 'Good',
    estimatedValue: 18750,
    confidenceScore: 89,
    isPremium: true,
    adjustments: [
      { factor: 'Mileage', impact: -500, description: 'Below average mileage for the year' },
      { factor: 'Market Demand', impact: 1200, description: 'High demand in your area' },
      { factor: 'Condition', impact: 300, description: 'Good overall condition' },
      { factor: 'Accident History', impact: -800, description: '1 minor accident reported' }
    ],
    explanation: 'This 2019 Toyota Camry is valued in the upper range for similar vehicles in your area. The good condition and lower-than-average mileage are positive factors, though the minor accident history slightly reduces the value. Currently, there is strong demand for midsize sedans in your region, which is reflected in the valuation.',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    bestPhotoUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    photoScore: 0.85,
    aiCondition: {
      condition: 'Good',
      confidenceScore: 82,
      issuesDetected: [
        'Minor scratches on rear bumper',
        'Slight wear on driver seat'
      ],
      aiSummary: 'Vehicle appears to be in good condition with only minor cosmetic issues detected. Interior shows normal wear for the vehicle age and mileage.'
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Heading level={1} className="mb-8">Car Detective Design System</Heading>
      
      <section className="mb-12">
        <Heading level={2} className="mb-4">Typography</Heading>
        <div className="space-y-4">
          <HeadingXL>Heading XL - The quick brown fox jumps over the lazy dog</HeadingXL>
          <HeadingL>Heading L - The quick brown fox jumps over the lazy dog</HeadingL>
          <BodyM>Body M - The quick brown fox jumps over the lazy dog</BodyM>
          <BodyS>Body S - The quick brown fox jumps over the lazy dog</BodyS>
          <Caption>Caption - The quick brown fox jumps over the lazy dog</Caption>
        </div>
      </section>
      
      <section className="mb-12">
        <Heading level={2} className="mb-4">Buttons</Heading>
        <div className="flex flex-wrap gap-4">
          <CDButton variant="primary">Primary Button</CDButton>
          <CDButton variant="secondary">Secondary Button</CDButton>
          <CDButton variant="ghost">Ghost Button</CDButton>
          <CDButton variant="outline">Outline Button</CDButton>
          <CDButton variant="danger">Danger Button</CDButton>
          <CDButton variant="primary" isLoading>Loading</CDButton>
          <CDButton variant="primary" icon={<Check className="h-4 w-4" />}>With Icon</CDButton>
        </div>
      </section>
      
      <section className="mb-12">
        <Heading level={2} className="mb-4">Cards</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CDCard>
            <CDCardHeader>
              <Heading level={3} className="text-xl">Card Title</Heading>
            </CDCardHeader>
            <CDCardBody>
              <BodyM>This is a basic card component with header and body.</BodyM>
            </CDCardBody>
          </CDCard>
          
          <CDCard>
            <CDCardHeader>
              <Heading level={3} className="text-xl">Interactive Card</Heading>
            </CDCardHeader>
            <CDCardBody>
              <BodyM className="mb-4">Cards can contain various UI elements like buttons and badges.</BodyM>
              <div className="flex gap-2">
                <CDButton variant="primary" size="sm">Action</CDButton>
                <CDBadge variant="info">New</CDBadge>
              </div>
            </CDCardBody>
          </CDCard>
        </div>
      </section>
      
      <section className="mb-12">
        <Heading level={2} className="mb-4">Badges</Heading>
        <div className="flex flex-wrap gap-3">
          <CDBadge variant="primary">Primary</CDBadge>
          <CDBadge variant="info">Info</CDBadge>
          <CDBadge variant="success">Success</CDBadge>
          <CDBadge variant="warning">Warning</CDBadge>
          <CDBadge variant="error">Error</CDBadge>
          <CDBadge variant="neutral">Neutral</CDBadge>
          <CDBadge variant="info" icon={<InfoIcon className="h-3 w-3" />}>With Icon</CDBadge>
          <CDBadge variant="error" icon={<AlertCircle className="h-3 w-3" />}>Alert</CDBadge>
        </div>
      </section>
      
      <section className="mb-12">
        <Heading level={2} className="mb-4">Tooltips</Heading>
        <div className="flex gap-6 items-center">
          <CDTooltip content="This is a tooltip">
            <CDButton variant="outline" size="sm">Hover me</CDButton>
          </CDTooltip>
          
          <CDTooltip 
            content={
              <div className="max-w-xs">
                <p className="font-medium">Rich Tooltip</p>
                <p className="text-xs mt-1">You can include multiple paragraphs and formatting in tooltips.</p>
              </div>
            }
          >
            <CDButton variant="outline" size="sm">Rich Tooltip</CDButton>
          </CDTooltip>
        </div>
      </section>
      
      <section className="mb-20">
        <Heading level={2} className="mb-4">Valuation Result Module</Heading>
        <div className="mt-6">
          <ValuationResult
            isManualValuation={true}
            manualValuationData={mockValuationData}
          />
        </div>
      </section>
    </div>
  );
};

export default DesignSystem;
