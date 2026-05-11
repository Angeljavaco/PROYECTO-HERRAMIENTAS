export const ADMIN_PRODUCTS_KEY = "adminProducts";
export const DELETED_PRODUCTS_KEY = "deletedProducts";

export const getProductCategory = (product) => {
  if (product.category) return product.category;

  const name = product.name.toLowerCase();

  if (name.includes("laptop")) return "laptops";
  if (name.includes("mouse") || name.includes("teclado")) return "accesorios";
  if (name.includes("monitor")) return "pantallas";

  return "otros";
};

export const normalizeProduct = (product) => ({
  ...product,
  id: Number(product.id),
  price: Number(product.price),
  stock: Number(product.stock || 0),
  category: getProductCategory(product),
  discount: product.discount ? Number(product.discount) : undefined
});

export const getLocalAdminProducts = () => (
  JSON.parse(localStorage.getItem(ADMIN_PRODUCTS_KEY)) || []
).map(normalizeProduct);

export const getDeletedProductIds = () => (
  JSON.parse(localStorage.getItem(DELETED_PRODUCTS_KEY)) || []
).map(Number);

export const mergeProductsForStore = (serverProducts) => {
  const adminProducts = getLocalAdminProducts();
  const deletedIds = getDeletedProductIds();
  const serverMap = new Map(
    serverProducts
      .filter((product) => !deletedIds.includes(Number(product.id)))
      .map((product) => [Number(product.id), normalizeProduct(product)])
  );

  adminProducts.forEach((product) => {
    if (!deletedIds.includes(Number(product.id))) {
      serverMap.set(Number(product.id), normalizeProduct(product));
    }
  });

  return Array.from(serverMap.values());
};

export const saveAdminProducts = (products) => {
  localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products.map(normalizeProduct)));
};

export const saveDeletedProductIds = (ids) => {
  localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(ids.map(Number)));
};
