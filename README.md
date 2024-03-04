
# E-commerce API with Express.js

This is a RESTful API for an e-commerce platform built using Express.js, a fast, unopinionated, minimalist web framework for Node.js. The API provides endpoints for managing products, users, orders, and more, enabling developers to build robust e-commerce applications.



## Features

- CRUD Operations: Perform CRUD (Create, Read, Update, Delete) operations on products, users, orders, and other entities.
- Authentication: Secure endpoints using JWT (JSON Web Tokens) for user authentication and authorization.
- Validation: Validate incoming data using middleware like Express Validator to ensure data integrity.
- Error Handling: Implement centralized error handling to gracefully handle errors and provide meaningful responses.
- Middleware: Utilize Express middleware for tasks such as logging, rate limiting, and request parsing.
- Database Integration: Connect to a database (MongoDB) for persistent data storage.
- Scalability: Designed with scalability in mind to handle a large number of concurrent users and requests.
- Testing: Comprehensive unit tests and integration tests ensure API reliability and functionality.


## Run Locally

Clone the project

```bash
  https://github.com/mmuokubamichael/E-commerce-with-ExpressJS-API.git
```

Go to the project directory

```bash
  cd E-commerce-with-ExpressJS-API
```

Install dependencies

```bash
  npm install
```

Create a .env file in the root directory and add the following variables:
```bash
PORT=3000
MONGODB_URI=mongodb://localhost/ecommerce
JWT_TOKEN=yoursecretkey
EMAIL_HOST_USER
EMAIL_HOST_PASSWORD
CLOUD_NAME
API_KEY
API_SECRET

```

Start the server

```bash
  npm run start
```


## Usage

Endpoints:

- GET /api/product/all: Retrieve all products.
- POST /api/product/create: Create a new product.
- POST /api/product/rate: Rate a product.
- PUT /api/product//upload/:id: upload images of a product.

Authentication

- POST /api/user/register: Register a new user
- POST /api/user/login: Authenticate user and generate JWT token.
- POST /api/user/forget-password:To get a new password
- GET /api/user/allusers:Get all users
- etc...

