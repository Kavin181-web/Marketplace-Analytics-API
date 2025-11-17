##Project TITLE: MARKETPLACE ANALYTICS API

//PROJECT DESCRIPTION:
This project is a backend API for a small marketplace system.
The main idea is to manage users, vendors, products, orders, payments, and reviews, and also provide different analytics using MongoDB aggregation.

The focus of the project is only backend and analytics.
There is no frontend in this assignment.


//TECH STACK USED:

Node.js
Express
MongoDB
Mongoose


//WHAT THIS API CAN DO

The API supports:

1. Basic CRUD operations

Create User
Create Vendor
Create Product
Create Order
Create Payment
Create Review
Fetch all Users, Vendors, Products, Orders, Reviews
Fetch by ID

2. Analytics APIs

Total revenue, total orders, avg order value
Top vendors by GMV
Top selling products
Category wise stats
Vendor rating analytics
Weekly revenue trend (12 weeks)

All analytics are built using MongoDB aggregation pipelines.


//PROJECT STRUCTURE

src/
 |-- analytics/
 |-- config/
 |-- controllers/
 |-- models/
 |-- routes/
 |-- seed/
app.js
.env
.gitignore
README.md
server.js


//HOW TO RUN THE PROJECT

Step 1: Install dependencies
npm install

Step 2: Create a .env file

MONGO_URI=your_mongodb_url
PORT=5000

Step 3: Start the server

npm start

You should see:

Server running on http://localhost:5000
MongoDB connected


//API ENDPOINTS

1.User APIs:

POST /api/users - create user  
GET /api/users - list user

2.Vendor APIs

POST /api/vendors    - create vendors
GET /api/vendors     - list vendors
GET /api/vendors/:id - list vendors ByID

3.Product APIs

POST /api/products    - create products
GET /api/products     - list products
GET /api/products/:id - list products ByID

4.Order APIs

POST /api/orders - create orders
GET /api/orders  - list orders

5.Payment APIs

POST /api/payments - create payments
POST /api/webhook  - webhook to update payment and order status

6.Review APIs

POST /api/reviews - create reviews
GET /api/reviews/:productId - get reviews for product

7.Analytics Endpoints

GET /api/analytics/overview      - total revenue, total orders, avg order value
GET /api/analytics/top-vendors   - top vendors by GMV
GET /api/analytics/top-products  - top-selling products
GET /api/analytics/category-stats- revenue and product count per category
GET /api/analytics/vendor-rating/:vendorId - average rating across vendor’s products
GET /api/analytics/revenue-trend - weekly revenue trend (last 12 weeks)


//POSTMAN (FOR TESTING THE API'S)


//POSTMAN COLLECTION

I have added all CRUD and analytics API requests in Postman.
The collection is arranged into 3 folders:

1.Basic-Setup

2.App Operations

3.Analytics Testing

I have also added an environment file for local testing.


//GITHUB (FOR SUBMISSION)


//Notes

-->.populate() is used to connect product → vendor and review → product

-->Virtual populate is used to show product → reviews

-->Aggregation pipelines are written in a simple way for readability


//Author

KavinKumar M