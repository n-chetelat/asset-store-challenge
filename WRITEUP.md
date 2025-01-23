# Changes to the original code

For this submission, I replaced the hard-coded data in the Express backend with `fetch` calls to the legacy service. For the `/api/products` route, I simply called the corresponding `/api/products` endpoint from the legacy API. For the `/api/products/:productId` route, I used the result of `/api/products` to search for the specific product name. To find the specific product price, I used the `/api/products/price?id=productId` endpoint. An object containing the product ID, name, and price is assembled from these steps and returned to the frontend. The `productId` parameter was validated and sanitized with the `express-validator` package to aid in preventing SQL injections.

To address the fact that the legacy API can only handle 5 requests per second, while still allowing the main application to handle 10 requests per second, I added a cache layer. The cache was added to the `docker-compose.yaml` file as a new service that communicates only with the two backend services. It consists of a Redis key-value store that interacts with the package `cache-manager` within the Express app. Requests to `/api/products` are cached with the key "products" every time, while requests to `/api/products/:productId` are cached by the product ID. I chose Redis instead of simply in-memory cache so that the two backend services could share the same cache, and also to avoid taking up memory in the Express services.

The changes in the Next.js service were not significant. I only changed the `/products/:id` route by replacing hard-coded values with the values coming from the API. I added a utility function to format the price correctly, and added the `cache: "force-cache"` option to all fetch requests, as the retrieved values do not change at all in this application. Some tests were added under `__tests__` to verify that data was correctly displayed on both the main page and the `/products/:id` page of the frontend service. These tests can be run with `npm run test` inside the `frontend` directory.

The load balancers were left untouched.

# Possible improvements

These are some of the ways the application can be made more robust:

- **Refactor backend:** The Express application could be modularized so that the routes are defined in a separate file from the server. Also, the business logic functions used inside the API routes could have a module of their own.

- **Authentication:** A more robust application would likely secure access to the Redis database with a username and password. This would require building a custom image for the `redis_cache` service that includes credentials from a configuration file.

- **Paginate products:** The list of products on the main page is 100 lines long. This view could be made more user-friendly by adding pagination.

- **Add integration tests:** The only tests in this submission are simple unit tests for the frontend portion. It would be useful to test that the APIs work as expected as well, and that the frontend can receive the data from the backend as expected.

- **Test error states:** This submission only includes tests that expect a successful outcome. A more robust application would also test for cases where something fails. For example, cases in which the backend service is not available or when a given product is not found.
