import express from "express";
import { Keyv } from "keyv";
import { createCache } from "cache-manager";
import { check, validationResult } from "express-validator";

const app = express();
const port = 3000;

const LEGACY_SERVICE_API = "http://legacy-backend:9991/api";

const cache = createCache({
  stores: [new Keyv()],
});

const productValidate = [
  check("productId", "Invalid product ID").matches("[0-9]").trim().escape(),
];

app.get("/api/products", async (req, res) => {
  const products = await getAllProducts();
  return res.json(products);
});

app.get("/api/products/:productId", productValidate, async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(422).json({ errors: validationErrors.array() });
  }
  const productId = req.params.productId;
  const product = await getProduct(productId);
  if (!product) {
    return res.sendStatus(404);
  }

  return res.json({
    id: product.id,
    name: product.name,
    price: product.price,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function getAllProducts() {
  const productsStr = await cache.get("products");
  let products;
  if (!productsStr) {
    const url = `${LEGACY_SERVICE_API}/products`;
    const response = await fetch(url);
    const data = await response.json();
    await cache.set("products", JSON.stringify(data?.products), 3600000);
    products = data.products;
  } else {
    products = JSON.parse(productsStr as string);
  }
  return products;
}

async function getProduct(productId) {
  const productStr = await cache.get(`product-${productId}`);
  let product;

  if (!productStr) {
    const products = await getAllProducts();
    const productInfo = products.find((p) => p.id === productId);
    if (!productInfo) {
      return null;
    }
    const price = await getPrice(productId);
    product = {
      id: productInfo.id,
      name: productInfo.name,
      price,
    };
    await cache.set(`product-${productId}`, JSON.stringify(product), 3600000);
  } else {
    product = JSON.parse(productStr as string);
  }

  return product;
}

async function getPrice(productId) {
  const url = `${LEGACY_SERVICE_API}/products/price?id=${productId}`;
  const response = await fetch(url);
  return await response.json();
}
