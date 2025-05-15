
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Check, AlertCircle, Info, X } from "lucide-react"
import { toast, Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster 
      className="toaster group" 
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg toast-default",
          success: "group toast group-[.toaster]:bg-green-50 group-[.toaster]:text-green-800 group-[.toaster]:border-green-600 toast-success",
          error: "group toast group-[.toaster]:bg-red-50 group-[.toaster]:text-red-800 group-[.toaster]:border-red-600 toast-destructive",
          warning: "group toast group-[.toaster]:bg-yellow-50 group-[.toaster]:text-yellow-800 group-[.toaster]:border-yellow-600 toast-warning",
          info: "group toast group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-800 group-[.toaster]:border-blue-600 toast-info",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
    />
  )
}

export { toast }
