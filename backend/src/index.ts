import express from "express";
import { check, validationResult } from "express-validator";

const app = express();
const port = 3000;

const LEGACY_SERVICE_API = "http://legacy-backend:9991/api";

const productValidate = [
  check("productId", "Invalid product ID").matches("[0-9]").trim().escape(),
];

app.get("/api/products", async (req, res) => {
  const products = await getAllProducts();
  return res.json(products.products);
});

app.get("/api/products/:productId", productValidate, async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(422).json({ errors: validationErrors.array() });
  }

  const productId = req.params.productId;
  const products = await getAllProducts();
  const product = products.products.find((p) => p.id === productId);
  if (!product) {
    return res.sendStatus(404);
  }
  const priceInfo = await getPrice(productId);
  return res.json({
    id: product.id,
    name: product.name,
    price: priceInfo.price,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function getAllProducts() {
  const url = `${LEGACY_SERVICE_API}/products`;
  const response = await fetch(url);
  return await response.json();
}

async function getPrice(productId) {
  const url = `${LEGACY_SERVICE_API}/products/price?id=${productId}`;
  const response = await fetch(url);
  return await response.json();
}
