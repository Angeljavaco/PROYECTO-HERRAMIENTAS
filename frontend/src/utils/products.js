export const ADMIN_PRODUCTS_KEY = "adminProducts";
export const DELETED_PRODUCTS_KEY = "deletedProducts";
export const CATALOG_RESTORE_VERSION_KEY = "catalogRestoreVersion";

const CURRENT_CATALOG_RESTORE_VERSION = "base-products-docker-restore-v1";

export const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Laptop Gamer",
    price: 3500,
    image: "https://oechsle.vteximg.com.br/arquivos/ids/21853812-1000-1000/2938864.jpg?v=638907148455170000",
    category: "laptops",
    discount: 50,
    stock: 10
  },
  {
    id: 2,
    name: "Mouse Inalambrico",
    price: 80,
    image: "https://oechsle.vteximg.com.br/arquivos/ids/18863606-1000-1000/imageUrl_1.jpg?v=638639596844600000",
    category: "accesorios",
    stock: 25
  },
  {
    id: 3,
    name: "Teclado Mecanico",
    price: 250,
    image: "https://oechsle.vteximg.com.br/arquivos/ids/24461600-1000-1000/imageUrl_1.jpg?v=639072506055830000",
    category: "accesorios",
    discount: 50,
    stock: 15
  },
  {
    id: 4,
    name: "Monitor 24 pulgadas",
    price: 900,
    image: "https://oechsle.vteximg.com.br/arquivos/ids/23773613-1000-1000/imageUrl_1.jpg?v=639036217581930000",
    category: "pantallas",
    stock: 12
  },
  {
    id: 5,
    name: "Audifonos Bluetooth",
    price: 180,
    image: "https://oechsle.vteximg.com.br/arquivos/ids/20196534-1000-1000/2406067jpg.jpg?v=638699726207630000",
    category: "accesorios",
    discount: 50,
    stock: 18
  },
  {
    id: 6,
    name: "Silla Gamer",
    price: 700,
    image: "https://oechsle.vteximg.com.br/arquivos/ids/16413338-1000-1000/SLS990101--1-.jpg?v=638321410430400000",
    category: "otros",
    stock: 8
  },
  {
    id: 7,
    name: "Webcam HD",
    price: 150,
    image: "https://oechsle.vteximg.com.br/arquivos/ids/24884064-1000-1000/imageUrl_1.jpg?v=639117435531500000",
    category: "accesorios",
    stock: 20
  },
  {
    id: 8,
    name: "Disco SSD 1TB",
    price: 400,
    image: "https://oechsle.vteximg.com.br/arquivos/ids/24421858-1000-1000/image-0.jpg?v=639070480478900000",
    category: "accesorios",
    stock: 14
  },
  {
    id: 9,
    name: "Memoria RAM 16GB",
    price: 320,
    image: "https://oechsle.vteximg.com.br/arquivos/ids/24516963-1000-1000/imageUrl_1.jpg?v=639077869501930000",
    category: "accesorios",
    stock: 16
  },
  {
    id: 10,
    name: "Laptop Ultrabook",
    price: 2800,
    image: "https://hiraoka.com.pe/media/catalog/product/d/2/d2kb2la_02imagenprincipalsintexto.jpg?quality=85&bg-color=255,255,255&fit=bounds&height=560&width=700&canvas=700:560",
    category: "laptops",
    stock: 7
  },
  {
    id: 11,
    name: "Tablet Android",
    price: 600,
    image: "https://oechsle.vteximg.com.br/arquivos/ids/21976484-1000-1000/2948373.jpg?v=638924194016200000",
    category: "otros",
    stock: 11
  },
  {
    id: 12,
    name: "Smartwatch",
    price: 250,
    image: "https://promart.vteximg.com.br/arquivos/ids/6536981-1000-1000/image-e1b6a9877a3b42efb43d90e8350db593.jpg?v=637993969074200000",
    category: "otros",
    stock: 13
  }
];

export const restoreDefaultCatalogVisibility = () => {
  if (localStorage.getItem(CATALOG_RESTORE_VERSION_KEY) === CURRENT_CATALOG_RESTORE_VERSION) return;

  localStorage.removeItem(DELETED_PRODUCTS_KEY);
  localStorage.setItem(CATALOG_RESTORE_VERSION_KEY, CURRENT_CATALOG_RESTORE_VERSION);
};

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
  restoreDefaultCatalogVisibility();

  const baseProducts = Array.isArray(serverProducts) && serverProducts.length > 0
    ? serverProducts
    : DEFAULT_PRODUCTS;
  const adminProducts = getLocalAdminProducts();
  const deletedIds = getDeletedProductIds();
  const serverMap = new Map(
    baseProducts
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
