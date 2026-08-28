import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <div>Home - Welcome to the store</div>;
}
function Products() {
  return <div>Products</div>;
}

export default function App() {
  return (
    <div>
      <header>
        <Link to="/">Home</Link> | <Link to="/products">Products</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </main>
    </div>
  );
}
