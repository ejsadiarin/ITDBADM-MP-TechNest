import React, { useEffect, useState } from 'react';

interface Product {
  product_id: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  image_url?: string;
  brand?: string;
  currency_id?: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Latest Tech Products</h1>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#00d8ff' }}>Loading products...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
        }}>
          {products.map(product => (
            <div key={product.product_id} style={{
              background: 'linear-gradient(135deg, #23272f 80%, #1de9b6 180%)',
              borderRadius: 18,
              boxShadow: '0 4px 24px #00d8ff22',
              padding: '2rem 1.5rem 1.5rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '1.5px solid #00d8ff33',
              minHeight: 340,
            }}>
              {product.image_url && (
                <img src={product.image_url} alt={product.name} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, marginBottom: 18, background: '#181a20' }} />
              )}
              <h2 style={{ color: '#00d8ff', margin: '0 0 0.5rem 0', fontSize: '1.3rem', textAlign: 'center' }}>{product.name}</h2>
              <div style={{ color: '#b0b3b8', fontSize: '1rem', marginBottom: 10, textAlign: 'center' }}>{product.brand}</div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem', marginBottom: 10 }}>
                ₱{Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div style={{ color: '#b0b3b8', fontSize: '0.98rem', marginBottom: 12, textAlign: 'center' }}>{product.description}</div>
              <button style={{ marginTop: 'auto', width: '100%' }}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
