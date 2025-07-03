# Flower Shop Server

This is the server-side implementation for the Flower Shop project. The server is built using Node.js and Express, and it connects to a MongoDB database to manage product and order data.

## Project Structure

- **controllers/**: Contains the logic for handling requests related to products and orders.
  - `productsController.js`: Handles product-related requests.
  - `ordersController.js`: Manages order-related requests.

- **models/**: Defines the data models for MongoDB.
  - `Product.js`: Schema for product documents.
  - `Order.js`: Schema for order documents.

- **routes/**: Sets up the API endpoints for the application.
  - `products.js`: Routes for product-related API endpoints.
  - `orders.js`: Routes for order-related API endpoints.

- `server.js`: The main server file that initializes the Express application and connects to the database.

- `package.json`: Contains metadata about the server-side project, including dependencies and scripts.

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   ```

2. **Navigate to the Server directory**:
   ```
   cd flower-shop/Server
   ```

3. **Install dependencies**:
   ```
   npm install
   ```

4. **Start the server**:
   ```
   npm start
   ```

The server will run on `http://localhost:5000` (or the port specified in your configuration).

## API Endpoints

- **Products**
  - `GET /api/products`: Retrieve all products.
  - `GET /api/products/:id`: Retrieve a specific product by ID.

- **Orders**
  - `POST /api/orders`: Create a new order.
  - `GET /api/orders/:id`: Retrieve a specific order by ID.

## Database

This project uses MongoDB as the database. Ensure that you have MongoDB installed and running, and update the connection string in `config/db.js` as necessary.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
