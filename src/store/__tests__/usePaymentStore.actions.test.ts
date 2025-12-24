import { renderHook, act } from '@testing-library/react';
import { usePaymentStore } from '../../store/usePaymentStore';
import * as api from '../../lib/api';

jest.mock('../../lib/api', () => ({
  paymentApi: {
    initiate: jest.fn(),
    uploadReceipt: jest.fn(),
    verify: jest.fn(),
    getByBookingId: jest.fn(),
  },
}));

describe('usePaymentStore actions', () => {
  it('initiates payment and sets currentPayment', async () => {
    (api.paymentApi.initiate as jest.Mock).mockResolvedValue({ data: { id: 1, bookingId: 10, amount: 5000, status: 'pending' } });

    const { result } = renderHook(() => usePaymentStore());
    await act(async () => {
      const payment = await result.current.initiatePayment(10, 'PAYSTACK', '08012345678');
      expect(payment).not.toBeNull();
    });
    expect(result.current.currentPayment?.status).toBe('pending');
    expect(result.current.loading).toBe(false);
  });

  it('verifies payment and updates currentPayment', async () => {
    (api.paymentApi.verify as jest.Mock).mockResolvedValue({ data: { id: 1, bookingId: 10, amount: 5000, status: 'verified' } });

    const { result } = renderHook(() => usePaymentStore());
    await act(async () => {
      await result.current.verifyPayment(1, 'REF-123');
    });
    expect(result.current.currentPayment?.status).toBe('verified');
    expect(result.current.error).toBeNull();
  });

  it('fetches payments by booking and sets list', async () => {
    (api.paymentApi.getByBookingId as jest.Mock).mockResolvedValue({ data: [{ id: 2, bookingId: 10, amount: 2500, status: 'verified' }] });

    const { result } = renderHook(() => usePaymentStore());
    await act(async () => {
      await result.current.fetchPaymentsByBookingId(10);
    });
    expect(result.current.payments.length).toBe(1);
    expect(result.current.payments[0].status).toBe('verified');
  });
});
