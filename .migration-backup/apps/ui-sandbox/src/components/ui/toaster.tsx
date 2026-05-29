<<<<<<< HEAD:apps/ui-sandbox/src/components/ui/toaster.tsx
import { useToast } from "@/hooks/useToast"
=======
import { useToast } from "@/hooks/useToast";
>>>>>>> b0339c51dfd079c07e92e8a339345bac22a4e52a:artifacts/snib-call/src/components/ui/toaster.tsx
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
