import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRoomStore } from '../useRoomStore';

jest.mock('../../lib/api', () => ({
  roomApi: {
    getByHostelId: jest.fn().mockResolvedValue({
      success: true,
      data: [{ id: 1, hostelId: 1, title: 'R1', type: 'Private', price: 50, description: '', available: 1, capacity: 1, image: '' }],
    }),
    getById: jest.fn(),
  },
}));

describe('useRoomStore actions', () => {
  it('fetches rooms by hostel and sets state', async () => {
    const { result } = renderHook(() => useRoomStore());
    await act(async () => {
      await result.current.fetchRoomsByHostelId('1');
    });
    expect(result.current.rooms.length).toBe(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
