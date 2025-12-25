import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { bookingApi } from '@/lib/api';

/**
 * Hook for polling booking status in real-time
 * Polls every 5 seconds when enabled and booking is not in final state
 * Uses bookingApi which handles authentication automatically
 * 
 * @param bookingId - The booking ID to poll
 * @param currentStatus - Current booking status
 * @param onStatusChange - Callback when status changes
 * @param enabled - Whether polling is enabled (default: true)
 */
export const useBookingStatusPolling = (
  bookingId: string | null | undefined,
  currentStatus: string | null | undefined,
  onStatusChange: (newStatus: string) => void,
  enabled: boolean = true
) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousStatusRef = useRef<string | null>(null);

  useEffect(() => {
    // Don't poll if disabled or no booking ID
    if (!enabled || !bookingId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Don't poll if booking is in final states
    const finalStates = ['room_allocated', 'cancelled', 'rejected', 'expired', 'completed'];
    if (currentStatus && finalStates.includes(currentStatus)) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Set up polling interval (5 seconds as per guide)
    intervalRef.current = setInterval(async () => {
      try {
        // Use bookingApi which handles auth automatically
        const response = await bookingApi.getById(bookingId);
        const newStatus = response.data?.status;

        // Only trigger callback if status actually changed
        if (newStatus && newStatus !== currentStatus && newStatus !== previousStatusRef.current) {
          previousStatusRef.current = newStatus;
          onStatusChange(newStatus);
          
          // Show notification for status changes
          const statusMessages: Record<string, string> = {
            'pending approval': 'Payment confirmed! Waiting for admin approval.',
            'approved': 'Booking approved! Waiting for room assignment.',
            'room_allocated': 'Room assigned! Check your room details.',
          };

          if (statusMessages[newStatus]) {
            toast.success(statusMessages[newStatus]);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
        // Don't show error toast on every polling failure to avoid spam
        // Only log to console
      }
    }, 5000); // Poll every 5 seconds

    // Cleanup on unmount or dependency change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [bookingId, currentStatus, enabled, onStatusChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
};

