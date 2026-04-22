import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/api';
import type { Product } from '../services/api';

const QUERY_KEY = ['wishlist'];

export function useWishlist() {
  return useQuery<Product[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await userService.getWishlist();
      return res.data?.products ?? res.data?.data ?? res.data ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useIsInWishlist(productId: number) {
  const { data } = useWishlist();
  return !!(data?.some((p) => p.id === productId));
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (productId: number) => {
      const current: Product[] = queryClient.getQueryData(QUERY_KEY) ?? [];
      const isIn = current.some((p) => p.id === productId);
      if (isIn) {
        await userService.removeWishlist(productId);
      } else {
        await userService.addWishlist(productId);
      }
    },
    onMutate: async (productId: number) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previous = queryClient.getQueryData<Product[]>(QUERY_KEY);
      queryClient.setQueryData<Product[]>(QUERY_KEY, (old = []) => {
        const isIn = old.some((p) => p.id === productId);
        if (isIn) return old.filter((p) => p.id !== productId);
        // Optimistically add a placeholder — will be replaced on settle
        return [...old, { id: productId } as Product];
      });
      return { previous };
    },
    onError: (_err, _productId, context: any) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
