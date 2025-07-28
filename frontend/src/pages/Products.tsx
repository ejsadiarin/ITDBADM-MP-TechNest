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
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    });
}, []);

  return (
    <div style={{ width: '100%', background: 'linear-gradient(135deg, #181f2a 60%, #00c6ff 180%)', minHeight: '100vh', padding: '2rem 0' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2.5rem', color: '#00c6ff', fontWeight: 800, letterSpacing: 1 }}>Latest Tech Products</h1>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#00d8ff', fontWeight: 600, fontSize: 20 }}>Loading products...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '2.2rem',
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {products.map(product => (
            <div
              key={product.product_id}
              style={{
                background: 'linear-gradient(135deg, #23272f 80%, #1de9b6 180%)',
                borderRadius: 20,
                boxShadow: '0 6px 32px #00c6ff22',
                padding: '2.2rem 1.5rem 1.5rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '1.5px solid #00c6ff33',
                minHeight: 370,
                transition: 'transform 0.18s, box-shadow 0.18s',
                cursor: 'pointer',
                position: 'relative',
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px) scale(1.03)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 36px #00c6ff44';
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLDivElement).style.transform = '';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 32px #00c6ff22';
              }}
            >
              {product.image_url && (
                <img src={product.image_url} alt={product.name} style={{ width: 130, height: 130, objectFit: 'cover', borderRadius: 14, marginBottom: 18, background: '#181a20', boxShadow: '0 2px 12px #00c6ff22' }} />
              )}
              <h2 style={{ color: '#00c6ff', margin: '0 0 0.5rem 0', fontSize: '1.35rem', textAlign: 'center', fontWeight: 700 }}>{product.name}</h2>
              <div style={{ color: '#b0b3b8', fontSize: '1.05rem', marginBottom: 8, textAlign: 'center', fontWeight: 500 }}>{product.brand}</div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', marginBottom: 8 }}>
                ₱{Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div style={{ color: '#b0b3b8', fontSize: '0.99rem', marginBottom: 14, textAlign: 'center', minHeight: 40 }}>{product.description}</div>
              <button
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '12px 0',
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: '0 2px 8px #00c6ff22',
                  cursor: 'pointer',
                  transition: 'background 0.18s',
                }}
              >
                Add to Cart
              </button>
              <div style={{ position: 'absolute', top: 18, right: 18, background: '#00c6ff', color: '#fff', borderRadius: 8, padding: '2px 10px', fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>
                #{product.product_id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
