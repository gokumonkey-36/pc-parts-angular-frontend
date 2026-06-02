# PC Parts Angular Frontend

Simple Angular frontend for the existing Django microservices. No backend files are changed.

## Backend defaults

- Product service: `http://localhost:8001/api/products`
- Order service: `http://localhost:8002/api/orders`

Update these in `src/environments/environment.ts` if your services run on different ports.

## Run

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Features

- Product list with category, brand, price, and search filters
- Featured products section
- Cart using the order service session cart API
- Checkout form
- Order history for the current browser session
