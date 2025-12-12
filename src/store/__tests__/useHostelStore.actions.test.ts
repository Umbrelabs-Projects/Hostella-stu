import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useHostelStore } from '../useHostelStore';

jest.mock('../../lib/api', () => ({
  hostelApi: {
    getAll: jest.fn().mockResolvedValue({
      success: true,
      data: [{ id: 1, name: 'H1', location: 'L', rating: 4.2, description: '', image: '' }],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
    }),
    getById: jest.fn(),
  },
}));

describe('useHostelStore actions', () => {
  it('fetches hostels and sets state', async () => {
    const { result } = renderHook(() => useHostelStore());
    await act(async () => {
      await result.current.fetchHostels({ page: 1, limit: 10 });
    });
    expect(result.current.hostels.length).toBe(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
