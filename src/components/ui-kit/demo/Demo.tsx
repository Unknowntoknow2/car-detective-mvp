import React from 'react';
import {
  HeadingXL,
  HeadingL,
  HeadingM,
  HeadingS,
  BodyL,
  BodyM,
  BodyS,
  Caption,
  Label,
} from '../typography';
import { CDButton } from '../CDButton';
import { CDCard, CDCardHeader, CDCardBody, CDCardFooter } from '../CDCard';
import { CDInput } from '../CDInput';
import { CDTooltip } from '../CDTooltip';
import { CDBadge } from '../CDBadge';
import { CDModal, CDModalHeader, CDModalBody, CDModalFooter } from '../CDModal';
import { CDTable } from '../CDTable';
import { CDTabs } from '../CDTabs';
import { CDNavbar } from '../CDNavbar';
import { CDFooter } from '../CDFooter';

const Demo = () => {
  const [modalOpen, setModalOpen] = useState(false);
  
  // Sample data for table
  const tableData = [
    { id: 1, name: 'Toyota Camry', price: '$28,500', year: 2023, condition: 'Excellent' },
    { id: 2, name: 'Honda Accord', price: '$27,800', year: 2022, condition: 'Good' },
    { id: 3, name: 'Ford Mustang', price: '$35,400', year: 2021, condition: 'Good' },
  ];
  
  // Define a proper type for the row parameter
  const renderActionCell = (row: { id: number; name: string; price: string; year: number; condition: string }) => (
    <CDBadge 
      variant={row.condition === 'Excellent' ? 'success' : 'info'}
      size="sm"
    >
      {row.condition}
    </CDBadge>
  );
  
  // Fix the table columns type
  const columns: TableColumn<{ id: number; name: string; price: string; year: number; condition: string }>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Price', accessor: 'price' },
    { header: 'Year', accessor: 'year' },
    { 
      header: 'Condition', 
      accessor: 'condition',
      cell: renderActionCell
    },
  ];
  
  const tabItems = [
    {
      label: 'Description',
      value: 'description',
      content: (
        <div className="space-y-4">
          <HeadingM>Vehicle Description</HeadingM>
          <BodyM>
            This 2023 Toyota Camry offers excellent fuel efficiency, advanced safety features, 
            and a comfortable interior. With its reputation for reliability and performance, 
            this sedan provides exceptional value for everyday driving and long trips alike.
          </BodyM>
        </div>
      ),
    },
    {
      label: 'Specifications',
      value: 'specs',
      content: (
        <div className="space-y-4">
          <HeadingM>Vehicle Specifications</HeadingM>
          <CDTable
            data={[
              { id: 1, feature: 'Engine', value: '2.5L 4-Cylinder' },
              { id: 2, feature: 'Transmission', value: '8-Speed Automatic' },
              { id: 3, feature: 'Fuel Economy', value: '28 city / 39 highway mpg' },
              { id: 4, feature: 'Horsepower', value: '203 hp @ 6,600 rpm' },
            ]}
            columns={[
              { header: 'Feature', accessor: 'feature' },
              { header: 'Value', accessor: 'value' },
            ]}
            compact={true}
          />
        </div>
      ),
    },
    {
      label: 'History',
      value: 'history',
      content: (
        <div className="space-y-4">
          <HeadingM>Vehicle History</HeadingM>
          <BodyM>
            This vehicle has a clean history with no reported accidents or damage.
            It has been regularly maintained according to the manufacturer's recommended schedule.
          </BodyM>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Navbar Demo */}
      <CDNavbar
        logoText="Car Detective"
        navItems={[
          { label: 'Home', href: '#', isActive: true },
          { label: 'Valuations', href: '#' },
          { label: 'Reports', href: '#' },
          { label: 'About', href: '#' },
        ]}
        actions={
          <CDButton variant="primary" size="sm">
            Get Started
          </CDButton>
        }
      />
      
      <div className="container mx-auto px-4">
        <HeadingXL className="mb-8">Car Detective UI Kit</HeadingXL>
        
        {/* Typography Section */}
        <section className="space-y-8 mb-12">
          <HeadingL>Typography</HeadingL>
          <div className="space-y-4">
            <HeadingXL>Heading XL</HeadingXL>
            <HeadingL>Heading L</HeadingL>
            <HeadingM>Heading M</HeadingM>
            <HeadingS>Heading S</HeadingS>
            <BodyL>Body L - This is larger body text for emphasizing important information.</BodyL>
            <BodyM>Body M - This is standard body text used for most paragraphs.</BodyM>
            <BodyS>Body S - This is smaller body text used for supporting information.</BodyS>
            <Caption>Caption - Used for supplementary text and meta information.</Caption>
            <Label>Label - Used for form labels and small headers.</Label>
          </div>
        </section>
        
        {/* Buttons Section */}
        <section className="space-y-8 mb-12">
          <HeadingL>Buttons</HeadingL>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4">
              <HeadingS>Primary</HeadingS>
              <div className="space-y-2">
                <CDButton variant="primary" size="lg">Large Button</CDButton>
                <CDButton variant="primary">Default Button</CDButton>
                <CDButton variant="primary" size="sm">Small Button</CDButton>
              </div>
            </div>
            
            <div className="space-y-4">
              <HeadingS>Secondary</HeadingS>
              <div className="space-y-2">
                <CDButton variant="secondary" size="lg">Large Button</CDButton>
                <CDButton variant="secondary">Default Button</CDButton>
                <CDButton variant="secondary" size="sm">Small Button</CDButton>
              </div>
            </div>
            
            <div className="space-y-4">
              <HeadingS>Ghost</HeadingS>
              <div className="space-y-2">
                <CDButton variant="ghost" size="lg">Large Button</CDButton>
                <CDButton variant="ghost">Default Button</CDButton>
                <CDButton variant="ghost" size="sm">Small Button</CDButton>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            <HeadingS>Button States</HeadingS>
            <div className="flex flex-wrap gap-4">
              <CDButton variant="primary" isLoading>Loading</CDButton>
              <CDButton variant="primary" disabled>Disabled</CDButton>
              <CDButton variant="primary" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              }>
                With Icon
              </CDButton>
              <CDButton variant="outline" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
                </svg>
              }>
                Download
              </CDButton>
            </div>
          </div>
        </section>
        
        {/* Cards Section */}
        <section className="space-y-8 mb-12">
          <HeadingL>Cards</HeadingL>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CDCard>
              <CDCardHeader>
                <HeadingM>Basic Card</HeadingM>
              </CDCardHeader>
              <CDCardBody>
                <BodyM>
                  This is a basic card with a header, body, and footer.
                  Cards are used to group and display content in a way that is
                  easy to scan and read.
                </BodyM>
              </CDCardBody>
              <CDCardFooter>
                <CDButton variant="primary" size="sm">Learn More</CDButton>
              </CDCardFooter>
            </CDCard>
            
            <CDCard variant="outline">
              <CDCardHeader>
                <HeadingM>Outline Card</HeadingM>
              </CDCardHeader>
              <CDCardBody>
                <BodyM>
                  This is an outline card with reduced visual weight.
                  It's useful for secondary information or when you
                  want to de-emphasize certain content.
                </BodyM>
              </CDCardBody>
              <CDCardFooter>
                <CDButton variant="outline" size="sm">Learn More</CDButton>
              </CDCardFooter>
            </CDCard>
            
            <CDCard variant="elevated" interactive onClick={() => alert('Interactive card clicked!')}>
              <CDCardHeader>
                <HeadingM>Interactive Card</HeadingM>
              </CDCardHeader>
              <CDCardBody>
                <BodyM>
                  This is an interactive card that can be clicked.
                  It's useful for navigation, selecting options, or
                  triggering actions.
                </BodyM>
              </CDCardBody>
              <CDCardFooter>
                <Caption>Click me to see what happens!</Caption>
              </CDCardFooter>
            </CDCard>
          </div>
        </section>
        
        {/* Form Elements */}
        <section className="space-y-8 mb-12">
          <HeadingL>Form Elements</HeadingL>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <CDInput 
                label="Standard Input"
                placeholder="Enter your name"
                helperText="This is a standard input field"
              />
              
              <CDInput 
                label="With Icon"
                placeholder="Search..."
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                  </svg>
                }
              />
              
              <CDInput 
                label="Error State"
                placeholder="Enter email"
                error={true}
                errorMessage="Please enter a valid email address"
                value="invalid-email"
              />
            </div>
            
            <div className="space-y-4">
              <CDInput 
                label="With Helper Text"
                placeholder="Enter password"
                type="password"
                helperText="Password must be at least 8 characters"
              />
              
              <CDInput 
                label="Disabled Input"
                placeholder="This field is disabled"
                disabled={true}
                value="Disabled value"
              />
              
              <CDInput 
                label="With Trailing Icon"
                placeholder="Enter a value"
                trailingIcon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                }
                onTrailingIconClick={() => alert('Clear input')}
              />
            </div>
          </div>
        </section>
        
        {/* Badges and Tooltips */}
        <section className="space-y-8 mb-12">
          <HeadingL>Badges & Tooltips</HeadingL>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <HeadingM>Badges</HeadingM>
              <div className="flex flex-wrap gap-2">
                <CDBadge variant="primary">Primary</CDBadge>
                <CDBadge variant="info">Info</CDBadge>
                <CDBadge variant="success">Success</CDBadge>
                <CDBadge variant="warning">Warning</CDBadge>
                <CDBadge variant="error">Error</CDBadge>
                <CDBadge variant="neutral">Neutral</CDBadge>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <CDBadge variant="primary" rounded>Rounded</CDBadge>
                <CDBadge variant="info" icon={
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                  </svg>
                }>
                  With Icon
                </CDBadge>
                <CDBadge 
                  variant="success" 
                  removable 
                  onRemove={() => alert('Badge removed!')}
                >
                  Removable
                </CDBadge>
              </div>
            </div>
            
            <div className="space-y-4">
              <HeadingM>Tooltips</HeadingM>
              <div className="flex gap-4 flex-wrap">
                <CDTooltip content="This is a tooltip" side="top">
                  <CDButton variant="secondary" size="sm">Top Tooltip</CDButton>
                </CDTooltip>
                
                <CDTooltip content="This is a tooltip" side="right">
                  <CDButton variant="secondary" size="sm">Right Tooltip</CDButton>
                </CDTooltip>
                
                <CDTooltip content="This is a tooltip" side="bottom">
                  <CDButton variant="secondary" size="sm">Bottom Tooltip</CDButton>
                </CDTooltip>
                
                <CDTooltip content="This is a tooltip" side="left">
                  <CDButton variant="secondary" size="sm">Left Tooltip</CDButton>
                </CDTooltip>
              </div>
              
              <div className="mt-4">
                <CDTooltip 
                  content={
                    <div className="p-1 max-w-xs">
                      <HeadingS className="mb-1">Advanced Tooltip</HeadingS>
                      <BodyS>
                        Tooltips can contain complex content including
                        headers, paragraphs, and even interactive elements.
                      </BodyS>
                    </div>
                  }
                  side="top"
                >
                  <CDButton variant="outline">Advanced Tooltip</CDButton>
                </CDTooltip>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tables Section */}
        <section className="space-y-8 mb-12">
          <HeadingL>Tables</HeadingL>
          <div className="space-y-4">
            <HeadingM>Basic Table</HeadingM>
            <CDTable
              data={tableData}
              columns={columns}
              caption="Vehicle Pricing Information"
              striped
              onRowClick={(row) => alert(`Selected: ${row.name}`)}
            />
            
            <div className="mt-6">
              <HeadingM>Compact Table</HeadingM>
              <CDTable
                data={tableData}
                columns={columns}
                compact
                bordered
              />
            </div>
          </div>
        </section>
        
        {/* Tabs Section */}
        <section className="space-y-8 mb-12">
          <HeadingL>Tabs</HeadingL>
          <div className="space-y-6">
            <div>
              <HeadingM className="mb-4">Underline Tabs</HeadingM>
              <CDTabs
                items={tabItems}
                variant="underline"
              />
            </div>
            
            <div className="mt-12">
              <HeadingM className="mb-4">Boxed Tabs</HeadingM>
              <CDTabs
                items={tabItems}
                variant="boxed"
                alignment="center"
              />
            </div>
            
            <div className="mt-12">
              <HeadingM className="mb-4">Minimal Tabs</HeadingM>
              <CDTabs
                items={tabItems}
                variant="minimal"
              />
            </div>
          </div>
        </section>
        
        {/* Modal Section */}
        <section className="space-y-8 mb-12">
          <HeadingL>Modal</HeadingL>
          <div className="space-y-4">
            <CDButton variant="primary" onClick={() => setModalOpen(true)}>
              Open Modal
            </CDButton>
            
            <CDModal
              open={modalOpen}
              onOpenChange={setModalOpen}
              title="Vehicle Information"
            >
              <CDModalBody>
                <BodyM>
                  This modal contains important information about your vehicle's
                  valuation. The estimated value is based on current market conditions,
                  vehicle condition, and comparable sales in your area.
                </BodyM>
                
                <div className="mt-4 p-3 bg-neutral-lighter rounded-md">
                  <HeadingM className="text-primary">$28,500</HeadingM>
                  <Caption>Estimated Market Value</Caption>
                </div>
              </CDModalBody>
              <CDModalFooter>
                <CDButton variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </CDButton>
                <CDButton variant="primary" onClick={() => setModalOpen(false)}>
                  Confirm
                </CDButton>
              </CDModalFooter>
            </CDModal>
          </div>
        </section>
      </div>
      
      {/* Footer Demo */}
      <CDFooter
        logo={
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 flex items-center justify-center rounded-md bg-primary text-white">
              CD
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Car Detective
            </span>
          </div>
        }
        sections={[
          {
            title: "Product",
            links: [
              { label: "Features", href: "#" },
              { label: "Pricing", href: "#" },
              { label: "Testimonials", href: "#" },
            ],
          },
          {
            title: "Resources",
            links: [
              { label: "Documentation", href: "#" },
              { label: "Guides", href: "#" },
              { label: "Support", href: "#" },
            ],
          },
          {
            title: "Company",
            links: [
              { label: "About", href: "#" },
              { label: "Careers", href: "#" },
              { label: "Contact", href: "#" },
            ],
          },
        ]}
        copyright={
          <>
            © {new Date().getFullYear()} Car Detective. All rights reserved.
            <div className="mt-2">
              <a href="#" className="text-sm hover:text-primary mr-4">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-primary">Terms of Service</a>
            </div>
          </>
        }
      />
    </div>
  );
};

export default Demo;

const ButtonDemo = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <CDButton>Default</CDButton>
      <CDButton variant="default" disabled>
        Disabled
      </CDButton>
      <CDButton variant="default" disabled>
        Disabled
      </CDButton>
    </div>
  );
};
