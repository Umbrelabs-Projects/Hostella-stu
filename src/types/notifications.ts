export interface Notification {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
    type: "info" | "success" | "warning" | "error";
  }
  