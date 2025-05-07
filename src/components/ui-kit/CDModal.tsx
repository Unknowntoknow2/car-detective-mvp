
import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { HeadingM } from "./typography";

export type ModalProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  showClose?: boolean;
  closeOnClickOutside?: boolean;
};

export type ModalHeaderProps = {
  children?: React.ReactNode;
  className?: string;
};

export type ModalBodyProps = {
  children: React.ReactNode;
  className?: string;
};

export type ModalFooterProps = {
  children: React.ReactNode;
  className?: string;
};

export const CDModal: React.FC<ModalProps> = ({
  children,
  open,
  onOpenChange,
  title,
  description,
  className,
  contentClassName,
  showClose = true,
  closeOnClickOutside = true,
}) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              asChild
              onInteractOutside={(e) => {
                if (!closeOnClickOutside) {
                  e.preventDefault();
                }
              }}
            >
              <motion.div
                className={cn(
                  "fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-md",
                  "translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-lg",
                  "bg-white p-6 shadow-xl border border-neutral-light",
                  "focus:outline-none focus-visible:ring-0",
                  className
                )}
                initial={{ opacity: 0, scale: 0.95, y: "-40%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, y: "-40%" }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={cn("flex flex-col space-y-4", contentClassName)}>
                  {title && (
                    <div className="flex items-start justify-between">
                      <HeadingM>{title}</HeadingM>
                      {showClose && (
                        <DialogPrimitive.Close asChild>
                          <button
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-dark hover:bg-neutral-lighter hover:text-neutral-darkest focus:outline-none"
                            aria-label="Close modal"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </button>
                        </DialogPrimitive.Close>
                      )}
                    </div>
                  )}
                  {description && <div>{description}</div>}
                  {children}
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

export const CDModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("mb-4 space-y-1.5 text-center sm:text-left", className)}>
      {children}
    </div>
  );
};

export const CDModalBody: React.FC<ModalBodyProps> = ({
  children,
  className,
}) => {
  return <div className={cn("flex-1 overflow-auto", className)}>{children}</div>;
};

export const CDModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
    >
      {children}
    </div>
  );
};

export default CDModal;
