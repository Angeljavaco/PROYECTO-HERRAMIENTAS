import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiUrl } from "../utils/api";
import {
  getDeletedProductIds,
  mergeProductsForStore,
  saveAdminProducts,
  saveDeletedProductIds
} from "../utils/products";

const initialForm = {
  id: "",
  name: "",
  price: "",
  image: "",
  category: "laptops",
  stock: "",
  discount: ""
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState("");

  const admin = localStorage.getItem("admin");

  useEffect(() => {
    if (!admin) {
      navigate("/admin-login");
      return;
    }

    fetch(apiUrl("/ProductController"))
      .then((res) => res.json())
      .then((data) => setProducts(mergeProductsForStore(data)))
      .catch(() => setProducts(mergeProductsForStore([])));
  }, [admin, navigate]);

  const stats = useMemo(() => {
    const totalInventory = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
    const averagePrice = products.length
      ? products.reduce((sum, product) => sum + Number(product.price || 0), 0) / products.length
      : 0;

    return {
      totalProducts: products.length,
      totalInventory,
      averagePrice
    };
  }, [products]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const persistProducts = (nextProducts) => {
    setProducts(nextProducts);
    saveAdminProducts(nextProducts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.image) {
      setNotice("Nombre, precio e imagen son obligatorios.");
      return;
    }

    const product = {
      id: editingId || Date.now(),
      name: form.name,
      price: Number(form.price),
      image: form.image,
      category: form.category,
      stock: Number(form.stock || 0),
      discount: form.discount ? Number(form.discount) : undefined
    };

    const nextProducts = editingId
      ? products.map((item) => (Number(item.id) === Number(editingId) ? product : item))
      : [product, ...products];

    persistProducts(nextProducts);
    setNotice(editingId ? "Producto actualizado correctamente." : "Producto agregado al catalogo.");
    resetForm();
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setForm({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category || "otros",
      stock: product.stock || "",
      discount: product.discount || ""
    });
    setNotice("");
  };

  const deleteProduct = (productId) => {
    const deletedIds = Array.from(new Set([...getDeletedProductIds(), Number(productId)]));
    const nextProducts = products.filter((product) => Number(product.id) !== Number(productId));

    saveDeletedProductIds(deletedIds);
    persistProducts(nextProducts);
    setNotice("Producto eliminado de la tienda.");
    if (Number(editingId) === Number(productId)) resetForm();
  };

  if (!admin) return null;

  return (
    <div className="app-shell">
      <Navbar />

      <main className="container">
        <header className="page-header admin-header">
          <p className="eyebrow">Administracion</p>
          <h1>Panel de productos</h1>
          <p>Agrega nuevos productos, actualiza precios, controla stock y elimina articulos del catalogo visible para usuarios.</p>
        </header>

        <section className="admin-stats">
          <article className="summary-panel">
            <p className="summary-label">Productos</p>
            <p className="summary-value">{stats.totalProducts}</p>
          </article>
          <article className="summary-panel">
            <p className="summary-label">Stock total</p>
            <p className="summary-value">{stats.totalInventory}</p>
          </article>
          <article className="summary-panel">
            <p className="summary-label">Precio promedio</p>
            <p className="summary-value">S/. {stats.averagePrice.toFixed(2)}</p>
          </article>
        </section>

        <section className="admin-layout">
          <form className="section-panel admin-form" onSubmit={handleSubmit}>
            <h2>{editingId ? "Editar producto" : "Agregar producto"}</h2>

            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input id="name" className="form-input" name="name" value={form.name} onChange={handleChange} />
            </div>

            <div className="admin-form-grid">
              <div className="form-group">
                <label htmlFor="price">Precio</label>
                <input id="price" className="form-input" name="price" type="number" min="0" value={form.price} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input id="stock" className="form-input" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} />
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="form-group">
                <label htmlFor="category">Categoria</label>
                <select id="category" className="select-input" name="category" value={form.category} onChange={handleChange}>
                  <option value="laptops">Laptops</option>
                  <option value="accesorios">Accesorios</option>
                  <option value="pantallas">Pantallas</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="discount">Descuento (%)</label>
                <input id="discount" className="form-input" name="discount" type="number" min="0" max="90" value={form.discount} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">URL de imagen</label>
              <input id="image" className="form-input" name="image" value={form.image} onChange={handleChange} />
            </div>

            {notice && <p className="admin-notice">{notice}</p>}

            <div className="admin-actions">
              <button className="btn btn-primary" type="submit">
                {editingId ? "Guardar cambios" : "Agregar producto"}
              </button>
              {editingId && (
                <button className="btn btn-ghost" type="button" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <section className="section-panel admin-table-panel">
            <div className="cart-header">
              <div>
                <h2>Catalogo</h2>
                <p className="muted">Productos visibles en la tienda.</p>
              </div>
            </div>

            <div className="admin-table">
              {products.map((product) => (
                <article className="admin-product-row" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div>
                    <p className="item-title">{product.name}</p>
                    <span className="item-meta">{product.category} · Stock: {product.stock || 0}</span>
                  </div>
                  <strong>S/. {Number(product.price).toFixed(2)}</strong>
                  <div className="admin-row-actions">
                    <button className="btn btn-ghost" onClick={() => editProduct(product)}>
                      Editar
                    </button>
                    <button className="btn btn-danger" onClick={() => deleteProduct(product.id)}>
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
