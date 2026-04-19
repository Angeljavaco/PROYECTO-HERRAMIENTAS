import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-detail" element={<OrderDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;