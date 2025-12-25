export interface Notification {
  id: string;
  type: 'broadcast' | 'new-booking' | 'payment-received' | 'room-allocated' | 'booking-approved' | 'booking-rejected' | 'booking-cancelled' | 'maintenance-alert' | 'complaint-received' | 'complaint-resolved';
  title: string;
  description: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
  time?: string; // Human-friendly relative time (e.g., "2 minutes ago")
}
