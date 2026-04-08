import React, { useEffect, useState } from "react";

function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/OnlineStoreApp/ProductController")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div>
      <h1>🛒 Productos</h1>

      {products.map(p => (
        <div key={p.id} style={{border:"1px solid #ccc", margin:"10px", padding:"10px"}}>
          <h3>{p.name}</h3>
          <p>S/. {p.price}</p>
          <button onClick={() => addToCart(p)}>Agregar al carrito</button>
        </div>
      ))}

     <h2>🧺 Carrito de Compras</h2>

{cart.length === 0 && <p>Carrito vacío</p>}

{cart.map((item, index) => (
  <div key={index}>
    {item.name} - S/. {item.price}
  </div>
))}

<h3>
  Total: S/. {cart.reduce((acc, item) => acc + item.price, 0)}
</h3>
    </div>
  );
}

export default Home;