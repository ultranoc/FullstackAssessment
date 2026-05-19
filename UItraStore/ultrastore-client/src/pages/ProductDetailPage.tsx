import { useNavigate, useParams } from 'react-router-dom';
import { useProduct } from '../api/products';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // TODO: implement useProduct in api/products.ts, then remove the comment below
  const { data: product, isLoading, isError } = useProduct(id);

  if (isLoading) return <div className="loading">Loading product...</div>;

  if (isError || !product) {
    return (
      <div className="product-detail-error">
        <p className="error-banner">Product not found.</p>
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="product-detail-content">
        {/* TODO: Render the product detail view */}

        <div className="product-detail-image">
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/600x400?text=No+Image';
            }}
          />
        </div>

        <div className="product-detail-info">
          {/* TODO: render product.categoryName as a badge */}
          {/* TODO: render product.name as an <h1> */}
          {/* TODO: render product.price formatted to 2 decimal places */}
          {/* TODO: render stock status (availableAmount) */}
          {/* TODO: render product.description */}
          {/* TODO: render product.createdAt and product.updatedAt */}
          <p style={{ color: 'var(--text-muted)' }}>
            Implement the detail view — see the TODO comments above.
          </p>
        </div>
      </div>
    </div>
  );
}
