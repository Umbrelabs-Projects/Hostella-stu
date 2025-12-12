import { renderHook, act } from '@testing-library/react';
import { useFAQStore } from '../../store/useFAQStore';
import * as api from '../../lib/api';

jest.mock('../../lib/api', () => ({
  faqApi: {
    getAll: jest.fn(),
    getCategories: jest.fn(),
  },
}));

describe('useFAQStore actions', () => {
  it('fetches FAQs', async () => {
    (api.faqApi.getAll as jest.Mock).mockResolvedValue({ data: [{ id: 1, question: 'Q1', answer: 'A1' }] });

    const { result } = renderHook(() => useFAQStore());
    await act(async () => {
      await result.current.fetchFAQs();
    });
    expect(result.current.faqs.length).toBe(1);
    expect(result.current.faqs[0].question).toBe('Q1');
  });

  it('fetches FAQ categories', async () => {
    (api.faqApi.getCategories as jest.Mock).mockResolvedValue({ data: ['general', 'billing'] });

    const { result } = renderHook(() => useFAQStore());
    await act(async () => {
      await result.current.fetchCategories();
    });
    expect(result.current.categories).toEqual(['general', 'billing']);
  });
});
