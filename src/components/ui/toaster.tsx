
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Check, AlertCircle, Info, X } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, variant, ...props }) {
        // Determine icon based on variant
        let Icon = Info;
        if (variant === 'success') Icon = Check;
        if (variant === 'destructive') Icon = AlertCircle;
        
        return (
          <Toast key={id} {...props} className="group">
            <div className="grid gap-1">
              {(title || variant) && (
                <ToastTitle className="flex items-center">
                  {variant && <Icon className="h-4 w-4 mr-2 flex-shrink-0" />}
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <ToastClose>
              <X className="h-4 w-4" />
            </ToastClose>
          </Toast>
        )
      })}
      <ToastViewport className="p-4" />
    </ToastProvider>
  )
}
