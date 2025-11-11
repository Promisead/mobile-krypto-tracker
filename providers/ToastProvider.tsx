import Toast from "@/components/Toast";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type?: "info" | "error" | "success" | "warning";
  }>({ visible: false, message: "", type: "info" });

  const showToast = useCallback(
    (message: string, type?: "info" | "error" | "success" | "warning") => {
      setToast({ visible: true, message, type: type ?? "info" });
    },
    []
  );

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type ?? "info"}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context)
    throw new Error("showToast must be used inside the Toast Provider");

  return context;
};
