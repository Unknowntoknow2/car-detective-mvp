
import * as React from "react";
import type * as DialogPrimitive from "@radix-ui/react-dialog";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

type DrawerRootProps = React.ComponentProps<typeof DrawerPrimitive.Root>;
type DrawerTriggerType = typeof DialogPrimitive.Trigger;
type DrawerPortalType = typeof DialogPrimitive.Portal;
type DrawerCloseType = typeof DialogPrimitive.Close;

type DrawerOverlayElement = React.ElementRef<typeof DialogPrimitive.Overlay>;
type DrawerOverlayProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

type DrawerContentElement = React.ElementRef<typeof DialogPrimitive.Content>;
type DrawerContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>;

type DrawerTitleElement = React.ElementRef<typeof DialogPrimitive.Title>;
type DrawerTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

type DrawerDescriptionElement = React.ElementRef<typeof DialogPrimitive.Description>;
type DrawerDescriptionProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: DrawerRootProps) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = "Drawer";

const DrawerTrigger: DrawerTriggerType = DrawerPrimitive.Trigger;

const DrawerPortal: DrawerPortalType = DrawerPrimitive.Portal;

const DrawerClose: DrawerCloseType = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  DrawerOverlayElement,
  DrawerOverlayProps
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  DrawerContentElement,
  DrawerContentProps
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children as React.ReactNode}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  DrawerTitleElement,
  DrawerTitleProps
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  DrawerDescriptionElement,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
