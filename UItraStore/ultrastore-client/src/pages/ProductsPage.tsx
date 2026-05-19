import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories, useProducts } from '../api/products';
import { ProductCard } from '../components/ProductCard';
import { Pagination } from '../components/Pagination';

const PAGE_SIZE = 20;

export default function ProductsPage() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [page, setPage] = useState(1);

    const navigate = useNavigate();

    // TODO (bonus): implement debounced search.
    // The search query should not fire on every keystroke — wait until the user
    // stops typing (350 ms is a good default).

    // TODO: implement useCategories to populate the category dropdown
    const { data: categories = [] } = useCategories();

    // TODO: implement useProducts to fetch the paginated product list.
    // Pass all active filters so React Query re-fetches when any of them changes.
    const { data: result, isLoading, isError } = useProducts({});

    function handleCategoryChange(value: string) {
        setCategory(value);
        setPage(1);
    }

    function handlePriceChange(field: 'min' | 'max', value: string) {
        if (field === 'min') setMinPrice(value);
        else setMaxPrice(value);
        setPage(1);
    }

    return (
        <div>
            <div className="controls">
                <input
                    className="search-input"
                    type="search"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="category-select"
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                {/* TODO: wire up price range inputs to the backend filter params */}
                <input
                    className="price-input"
                    type="number"
                    placeholder="Min price"
                    value={minPrice}
                    min={0}
                />
                <input
                    className="price-input"
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    min={0}
                />
            </div>

            {isError && (
                <div className="error-banner">
                    Failed to load products. Is the API running on port 5100?
                </div>
            )}

            {isLoading ? (
                <div className="loading">Loading...</div>
            ) : result && result.items.length === 0 ? (
                <div className="empty">No products found.</div>
            ) : (
                <>
                    <div className="product-grid">
                        {result?.items.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => navigate(`/products/${product.id}`)}
                            />
                        ))}
                    </div>
                    {result && (
                        <Pagination
                            page={result.page}
                            pageSize={result.pageSize}
                            totalCount={result.totalCount}
                            hasNextPage={result.hasNextPage}
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}
        </div>
    );
}
