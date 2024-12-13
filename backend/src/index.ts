import express from 'express';

const app = express()
const port = 3000

const LEGACY_SERVICE_API = 'http://legacy-backend:9991/api';

app.get('/api/products', (req, res) => {
  return res.json(
    [
      {
        id: "5246",
        name: "Fusion Pure Speaker"
      },
      {
        id: "2902",
        name: "Fresh Durable Headphones"
      }
    ]
  )
})

app.get('/api/products/:productId', (req, res) => {
  return res.json({
    id: "5246",
    name: "Fusion Pure Speaker",
    price: 310.2
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
