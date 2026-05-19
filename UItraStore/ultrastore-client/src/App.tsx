import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
// TODO (bonus): import { ProductProvider } from './context/ProductContext';
import './App.css';

export default function App() {
  return (
    // TODO (bonus): wrap the router tree with <ProductProvider> so that
    // ProductsPage and its children can share filter state via context
    // instead of passing props down through multiple levels.
    <BrowserRouter>
      <header className="app-header">
        <h1>UItraStore</h1>
        <p className="subtitle">Products from the scraper</p>
      </header>
      <div className="app">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
