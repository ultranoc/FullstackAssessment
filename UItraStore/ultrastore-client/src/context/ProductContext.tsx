import { createContext, useContext, useState, type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// BONUS TASK — Context API
//
// Goal: eliminate prop drilling by lifting filter state into a shared context.
//
// Steps:
//   1. Implement ProductProvider (the setters below are placeholders — complete them)
//   2. Add the ProductProvider to the site
//   3. Eliminate prop drilling (e.g. a dedicated FilterBar)
// ---------------------------------------------------------------------------

export interface ProductFilters {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  page: number;
}

const defaultFilters: ProductFilters = {
  search: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  page: 1,
};

interface ProductContextType {
  filters: ProductFilters;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setMinPrice: (minPrice: string) => void;
  setMaxPrice: (maxPrice: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

// TODO: Complete each setter below.
export function ProductProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);

  function setSearch(search: string) {
      // TODO: implement
  }

  function setCategory(category: string) {
    // TODO: implement
  }

  function setMinPrice(minPrice: string) {
    // TODO: implement
  }

  function setMaxPrice(maxPrice: string) {
    // TODO: implement
  }

  function setPage(page: number) {
    // TODO: implement
  }

  function resetFilters() {
    // TODO: implement
  }

  return (
    <ProductContext.Provider
      value={{ filters, setSearch, setCategory, setMinPrice, setMaxPrice, setPage, resetFilters }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// Custom hook — throws a descriptive error when used outside ProductProvider.
export function useProductFilters(): ProductContextType {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProductFilters must be used inside a ProductProvider.');
  }
  return ctx;
}
