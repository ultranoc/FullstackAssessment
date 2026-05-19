import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import type { PagedResult, Product } from '../types/product';
import type { Category } from '../types/category';

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

// TODO: Implement useProducts using React Query's useQuery.
//
// Requirements:
//   - Call GET /api/products with the provided filter params as query string
//   - queryKey must include all filter values so the cache re-fetches when any filter changes
//   - Use apiClient (Axios) to make the request
//
// Hint: build URLSearchParams from the filters object, then:
//   const { data } = await apiClient.get<PagedResult<Product>>(`/products?${params}`)
//   return data
export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async (): Promise<PagedResult<Product>> => {
      // TODO: implement
      throw new Error('useProducts is not implemented yet.');
    },
  });
}

// TODO: Implement useProduct using React Query's useQuery.
//
// Requirements:
//   - Call GET /api/products/:id
//   - Only run the query when `id` is defined (use the `enabled` option)
//   - Use apiClient to make the request
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product> => {
      // TODO: implement
      throw new Error('useProduct is not implemented yet.');
    },
    enabled: !!id,
  });
}

// TODO: Implement useCategories using React Query's useQuery.
//
// Requirements:
//   - Call GET /api/categories
//   - Use apiClient to make the request
export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async (): Promise<Category[]> => {
            // TODO: implement
            throw new Error('useCategories is not implemented yet.');
        }
    });
}