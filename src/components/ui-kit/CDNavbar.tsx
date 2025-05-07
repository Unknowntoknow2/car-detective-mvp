
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type NavItem = {
  label: React.ReactNode;
  href: string;
  isActive?: boolean;
  icon?: React.ReactNode;
};

export type NavbarProps = {
  logoComponent?: React.ReactNode;
  logoText?: string;
  navItems?: NavItem[];
  children?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: "transparent" | "solid" | "glass";
  sticky?: boolean;
  className?: string;
  containerClassName?: string;
  collapsed?: boolean;
  onToggle?: () => void;
};

export const CDNavbar: React.FC<NavbarProps> = ({
  logoComponent,
  logoText,
  navItems = [],
  children,
  actions,
  variant = "solid",
  sticky = false,
  className,
  containerClassName,
  collapsed = false,
  onToggle,
}) => {
  // Variant classes
  const variantClasses = {
    transparent: "bg-transparent",
    solid: "bg-white shadow-sm border-b border-neutral-light",
    glass: "bg-white/80 backdrop-blur-md border-b border-neutral-light/50",
  };

  return (
    <header
      className={cn(
        "w-full z-40",
        sticky && "sticky top-0",
        variantClasses[variant],
        className
      )}
    >
      <div
        className={cn(
          "px-4 md:px-6 mx-auto",
          "flex h-16 items-center justify-between",
          containerClassName
        )}
      >
        {/* Logo and brand */}
        <div className="flex items-center">
          {/* Logo/branding */}
          <div className="flex items-center gap-2 font-medium">
            {logoComponent || (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 flex items-center justify-center rounded-md bg-primary text-white">
                  CD
                </div>
                {logoText && (
                  <span className="text-lg font-semibold tracking-tight">
                    {logoText}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links - Hidden on Mobile */}
        <nav className="hidden md:flex items-center gap-1">
          {children ||
            navItems.map((item, i) => (
              <NavLink key={i} item={item} />
            ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {actions}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-neutral-darker hover:bg-neutral-lighter"
            onClick={onToggle}
            aria-expanded={collapsed}
          >
            <span className="sr-only">
              {collapsed ? "Close menu" : "Open menu"}
            </span>
            {collapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Collapsed by default */}
      <motion.div
        className="md:hidden overflow-hidden"
        initial="closed"
        animate={collapsed ? "open" : "closed"}
        variants={{
          open: { height: "auto", opacity: 1 },
          closed: { height: 0, opacity: 0 },
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="px-4 py-2 space-y-1 border-t border-neutral-light">
          {children ||
            navItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                  item.isActive
                    ? "bg-primary/10 text-primary"
                    : "text-neutral-darker hover:bg-neutral-lighter"
                )}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </a>
            ))}
        </div>
      </motion.div>
    </header>
  );
};

const NavLink: React.FC<{ item: NavItem }> = ({ item }) => {
  return (
    <a
      href={item.href}
      className={cn(
        "relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
        item.isActive
          ? "text-primary"
          : "text-neutral-darker hover:text-primary hover:bg-neutral-lighter"
      )}
    >
      <span className="flex items-center gap-1.5">
        {item.icon && <span>{item.icon}</span>}
        {item.label}
      </span>
      {item.isActive && (
        <motion.span
          className="absolute inset-x-0 bottom-0 h-0.5 bg-primary rounded-full"
          layoutId="navbar-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </a>
  );
};

export default CDNavbar;
