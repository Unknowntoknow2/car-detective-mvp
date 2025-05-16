
import React from 'react';
import { render } from '@testing-library/react';
import CDButton from '../button/CDButton';
import { CDCard, CDCardHeader, CDCardBody, CDCardFooter } from '../CDCard';
import { CDInput } from '../CDInput';
import { CDBadge } from '../CDBadge';
import { CDNavbar } from '../CDNavbar';
import { CDFooter } from '../CDFooter';

// Import directly from @testing-library/dom
import { screen, fireEvent } from '@testing-library/dom';

// Button Tests
describe('CDButton', () => {
  it('renders button with children', () => {
    render(<CDButton>Click Me</CDButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<CDButton variant="primary">Primary</CDButton>);
    expect(screen.getByText('Primary')).toHaveClass('bg-primary');

    rerender(<CDButton variant="secondary">Secondary</CDButton>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');

    rerender(<CDButton variant="ghost">Ghost</CDButton>);
    expect(screen.getByText('Ghost')).toHaveClass('hover:bg-accent');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<CDButton onClick={handleClick}>Click Me</CDButton>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders loading and disabled states correctly', () => {
    const { rerender } = render(<CDButton isLoading>Loading</CDButton>);
    expect(screen.getByRole('button')).toBeDisabled();
    
    rerender(<CDButton disabled>Disabled</CDButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

// Card Tests
describe('CDCard', () => {
  it('renders card with children', () => {
    render(
      <CDCard>
        <div>Card Content</div>
      </CDCard>
    );
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders card with header, body and footer', () => {
    render(
      <CDCard>
        <CDCardHeader>Card Header</CDCardHeader>
        <CDCardBody>Card Body</CDCardBody>
        <CDCardFooter>Card Footer</CDCardFooter>
      </CDCard>
    );
    expect(screen.getByText('Card Header')).toBeInTheDocument();
    expect(screen.getByText('Card Body')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(
      <CDCard variant="default">Default Card</CDCard>
    );
    expect(screen.getByText('Default Card').closest('div')).toHaveClass('bg-white');

    rerender(<CDCard variant="outline">Outline Card</CDCard>);
    expect(screen.getByText('Outline Card').closest('div')).toHaveClass('border-neutral-light');

    rerender(<CDCard variant="elevated">Elevated Card</CDCard>);
    expect(screen.getByText('Elevated Card').closest('div')).toHaveClass('shadow-md');
  });

  it('handles click events when interactive', () => {
    const handleClick = jest.fn();
    render(
      <CDCard interactive onClick={handleClick}>
        Interactive Card
      </CDCard>
    );
    fireEvent.click(screen.getByText('Interactive Card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// Input Tests
describe('CDInput', () => {
  it('renders input with label', () => {
    render(<CDInput label="Name" placeholder="Enter your name" />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(
      <CDInput
        label="Password"
        helperText="Password must be at least 8 characters"
        type="password"
      />
    );
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('shows error state and message', () => {
    render(
      <CDInput
        label="Email"
        error={true}
        errorMessage="Please enter a valid email"
      />
    );
    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<CDInput label="Disabled Field" disabled />);
    expect(screen.getByLabelText('Disabled Field')).toBeDisabled();
  });
});

// Badge Tests
describe('CDBadge', () => {
  it('renders badge with children', () => {
    render(<CDBadge>New</CDBadge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<CDBadge variant="primary">Primary</CDBadge>);
    expect(screen.getByText('Primary')).toHaveClass('bg-primary-light');

    rerender(<CDBadge variant="success">Success</CDBadge>);
    expect(screen.getByText('Success')).toHaveClass('bg-success-light');
  });

  it('handles removable badges', () => {
    const handleRemove = jest.fn();
    render(
      <CDBadge removable onRemove={handleRemove}>
        Removable
      </CDBadge>
    );
    
    const removeButton = screen.getByRole('button', { name: /remove badge/i });
    fireEvent.click(removeButton);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });
});

// Navbar Tests
describe('CDNavbar', () => {
  it('renders logo and text', () => {
    render(<CDNavbar logoText="Car Detective" />);
    expect(screen.getByText('Car Detective')).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(
      <CDNavbar
        navItems={[
          { label: 'Home', href: '#', isActive: true },
          { label: 'About', href: '#' },
        ]}
      />
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(
      <CDNavbar
        actions={
          <CDButton variant="primary" size="sm">
            Get Started
          </CDButton>
        }
      />
    );
    
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });
});

// Footer Tests
describe('CDFooter', () => {
  it('renders copyright information', () => {
    render(
      <CDFooter
        copyright="© 2025 Car Detective. All rights reserved."
      />
    );
    
    expect(screen.getByText('© 2025 Car Detective. All rights reserved.')).toBeInTheDocument();
  });

  it('renders footer links', () => {
    render(
      <CDFooter
        sections={[
          {
            title: "Resources",
            links: [
              { label: "Documentation", href: "#" },
              { label: "Support", href: "#" },
            ],
          },
        ]}
      />
    );
    
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });
});
