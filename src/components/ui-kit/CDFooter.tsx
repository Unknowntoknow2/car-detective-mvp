
import React from "react";
import { cn } from "@/lib/utils";
import { Caption } from "./typography";

export type FooterLink = {
  label: React.ReactNode;
  href: string;
  target?: string;
  icon?: React.ReactNode;
};

export type FooterSection = {
  title?: string;
  links: FooterLink[];
};

export type FooterProps = {
  logo?: React.ReactNode;
  sections?: FooterSection[];
  copyright?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  simple?: boolean;
  variant?: "light" | "dark" | "neutral";
  bordered?: boolean;
};

export const CDFooter: React.FC<FooterProps> = ({
  logo,
  sections = [],
  copyright,
  className,
  containerClassName,
  simple = false,
  variant = "light",
  bordered = true,
}) => {
  // Variant classes
  const variantClasses = {
    light: "bg-white text-neutral-darker",
    dark: "bg-neutral-darkest text-white",
    neutral: "bg-neutral-lighter text-neutral-darker",
  };

  if (simple) {
    return (
      <footer
        className={cn(
          "w-full py-4",
          bordered && "border-t border-neutral-light",
          variantClasses[variant],
          className
        )}
      >
        <div
          className={cn(
            "px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-4",
            containerClassName
          )}
        >
          <div className="flex items-center gap-4">
            {logo && <div>{logo}</div>}
            <div className="flex gap-4">
              {sections[0]?.links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target={link.target}
                  className="text-sm hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          {copyright && (
            <Caption className="text-center md:text-right">
              {copyright}
            </Caption>
          )}
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={cn(
        "w-full py-8 md:py-12",
        bordered && "border-t border-neutral-light",
        variantClasses[variant],
        className
      )}
    >
      <div
        className={cn(
          "px-4 md:px-6 mx-auto",
          containerClassName
        )}
      >
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo and company info */}
          {logo && (
            <div className="col-span-2 md:col-span-1 lg:col-span-2">
              <div>{logo}</div>
            </div>
          )}

          {/* Footer sections */}
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-3">
              {section.title && (
                <h4 className="text-sm font-semibold uppercase tracking-wider">
                  {section.title}
                </h4>
              )}
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      target={link.target}
                      className="text-sm hover:text-primary transition-colors inline-flex items-center gap-1.5"
                    >
                      {link.icon && <span>{link.icon}</span>}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright notice */}
        {copyright && (
          <div className="mt-8 pt-8 border-t border-neutral-light/30">
            <Caption className="text-center">{copyright}</Caption>
          </div>
        )}
      </div>
    </footer>
  );
};

export default CDFooter;
