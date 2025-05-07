
import React from "react";
import { typography } from "./tokens";
import { cn } from "@/lib/utils";

type TypographyProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

export const HeadingXL = ({
  children,
  className,
  as: Component = "h1",
}: TypographyProps) => (
  <Component
    className={cn(
      "font-primary text-4xl font-bold tracking-tight leading-tight text-neutral-darkest",
      className
    )}
  >
    {children}
  </Component>
);

export const HeadingL = ({
  children,
  className,
  as: Component = "h2",
}: TypographyProps) => (
  <Component
    className={cn(
      "font-primary text-3xl font-semibold tracking-tight leading-tight text-neutral-darkest",
      className
    )}
  >
    {children}
  </Component>
);

export const HeadingM = ({
  children,
  className,
  as: Component = "h3",
}: TypographyProps) => (
  <Component
    className={cn(
      "font-primary text-2xl font-semibold tracking-tight leading-tight text-neutral-darkest",
      className
    )}
  >
    {children}
  </Component>
);

export const HeadingS = ({
  children,
  className,
  as: Component = "h4",
}: TypographyProps) => (
  <Component
    className={cn(
      "font-primary text-xl font-medium tracking-tight leading-tight text-neutral-darkest",
      className
    )}
  >
    {children}
  </Component>
);

export const BodyL = ({
  children,
  className,
  as: Component = "p",
}: TypographyProps) => (
  <Component
    className={cn(
      "font-primary text-lg font-normal leading-relaxed text-neutral-darker",
      className
    )}
  >
    {children}
  </Component>
);

export const BodyM = ({
  children,
  className,
  as: Component = "p",
}: TypographyProps) => (
  <Component
    className={cn(
      "font-primary text-base font-normal leading-relaxed text-neutral-darker",
      className
    )}
  >
    {children}
  </Component>
);

export const BodyS = ({
  children,
  className,
  as: Component = "p",
}: TypographyProps) => (
  <Component
    className={cn(
      "font-primary text-sm font-normal leading-relaxed text-neutral-darker",
      className
    )}
  >
    {children}
  </Component>
);

export const Caption = ({
  children,
  className,
  as: Component = "span",
}: TypographyProps) => (
  <Component
    className={cn(
      "font-primary text-xs font-normal leading-relaxed text-neutral-dark",
      className
    )}
  >
    {children}
  </Component>
);

export const Label = ({
  children,
  className,
  as: Component = "label",
}: TypographyProps) => (
  <Component
    className={cn(
      "font-primary text-sm font-medium leading-tight text-neutral-darker",
      className
    )}
  >
    {children}
  </Component>
);

export const Code = ({
  children,
  className,
  as: Component = "code",
}: TypographyProps) => (
  <Component
    className={cn(
      "font-mono text-sm px-1.5 py-0.5 rounded-sm bg-neutral-lighter text-neutral-darkest",
      className
    )}
  >
    {children}
  </Component>
);

export const Quote = ({
  children,
  className,
  as: Component = "blockquote",
}: TypographyProps) => (
  <Component
    className={cn(
      "font-primary text-lg italic border-l-4 border-primary pl-4 py-1 text-neutral-darker",
      className
    )}
  >
    {children}
  </Component>
);
