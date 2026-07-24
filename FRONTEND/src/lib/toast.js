import { toast } from "sonner";

export const showError = (message) => toast.error(message);
export const showSuccess = (message) => toast.success(message);
export const showInfo = (message) => toast.info(message);

export const showSessionExpired = () =>
  toast.error("Your session has expired. Please log in again.", { id: "session-expired" });

export default toast;
