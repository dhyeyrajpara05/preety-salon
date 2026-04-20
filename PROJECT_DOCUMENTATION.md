# Preety Salon Project Documentation

## 1. Project Overview

Preety Salon is a comprehensive salon management system consisting of a client-side website, an administrative dashboard, and a robust back-end supporting both.

### Technology Stack

- **Frontend**: React.js with Vite, Vanilla CSS.
- **Backend**: Node.js with Express.js.
- **Database**: MongoDB with Mongoose (ODM).
- **Payment Gateway**: Razorpay Integration.
- **Other Tools**: Multer (file uploads), Bcrypt.js (password hashing), Nodemailer (OTP/Emails), Recharts (data visualization), Lenis (smooth scrolling).

---

## 2. API Architecture

The project uses two separate server entry points to isolate client and admin concerns:

### Client Server (`backend/client_server.cjs` - Port 5000)

Handles all public-facing and user-specific operations:

- **Authentication**: Registration, Login, Forgot/Reset Password (via OTP).
- **Product Store**: Catalog fetching, detailed product views, and reviews.
- **Cart & Orders**: CRUD operations for the shopping cart and checkout processing.
- **Services & Packages**: Browsing salon services and membership packages.
- **Payments**: Razorpay order creation and signature verification.
- **User Profile**: Managing user data, order history, and membership status.

### Admin Server (`backend/admin_server.cjs` - Port 5001)

Handles staff-side operations and business logic:

- **Dashboard Stats**: Aggregated metrics for sales, visits, and recent activity.
- **Inventory Management**: CRUD for Products, Categories, and Services.
- **Operations**: Managing Appointments, Staff profiles, and Customer records.
- **Billing**: Generation of Invoices and management of payments.
- **Reports**: Advanced analytics and data export (Excel).
- **User Management**: Blocking/Unblocking users.

---

## 3. Database Schema (MongoDB Collections)

The project utilizes **17 collections** in the `preetysalon` database:

1.  **user**: Registered website users (credentials, profile pics, status).
2.  **tblproduct**: Salon products for sale (name, price, stock, images).
3.  **tblcategory**: Category groupings for products and services.
4.  **tblservice**: Service catalog (Hair, Skin, Spa) with pricing and duration.
5.  **tblpackage**: Membership or promotional bundles.
6.  **tblcart**: Temporary storage for user shopping items.
7.  **tblorder**: Records of product orders placed via the website.
8.  **tblappointment**: Salon visit bookings with status tracking.
9.  **Customer**: Master list of salon clients (for CRM and Billing).
10. **MembershipPlan**: Definition of available membership tiers.
11. **Staff**: Employee profiles, designations, and offered services.
12. **Invoice**: Detailed billing records for services and products.
13. **Feedback**: Service feedback and ratings provided by customers.
14. **ProductReview**: Ratings and comments for store products.
15. **Inquiry**: Contact/Inquiry forms submitted via the website.
16. **Notification**: System-generated alerts for admin and users.
17. **Payment**: Logs of transaction attempts and verification status.

---

## 4. Features & Logic

### Searching & Sorting

- **Sorting**: Most data lists (Products, Orders, Users) are sorted by `createdAt: -1` (newest first) or specific date fields using Mongoose's `.sort()` method.
- **Searching**:
  - **Back-end**: Uses MongoDB regex queries or direct field matching (e.g., searching by `pid` or `email`).
  - **Front-end**: Many tables (like Invoices or Customers) implement real-time client-side filtering based on state variables as the user types.

### Dashboard Graphs

The admin dashboard uses two different approaches for visualizations:

- **Quick Stats (Main Dashboard)**: Uses pure **CSS and HTML** (specifically `conic-gradient`) to create lightweight pie charts and status blocks without external libraries.
- **Analytical Reports**: The **Reports** page utilizes the **Recharts** library to generate detailed Bar Charts and Pie Charts for yearly revenue, staff performance, and category breakdowns.

### Notification System

- **Storage**: All alerts are stored in the `Notification` collection.
- **Triggers**:
  - **New Order**: When a client completes a checkout, an `order` type notification is sent to the `admin`.
  - **Status Updates**: When an admin updates an order or appointment, a notification is sent to the specific `recipientId` (the user).
  - **Bookings/Feedback**: Appointments and Feedbacks also trigger admin-side notifications.
- **UI**: The Admin's **Activity Stream** fetches these in real-time, allowing them to browse by category (Order, Appointment, etc.) and mark them as read.

### Payments (Razorpay)

1. **Order Creation**: The client requests a Razorpay order from the backend.
2. **Payment record**: A temporary record is created in the `Payment` collection with status `created`.
3. **Checkout**: The user completes the payment on the Razorpay gateway.
4. **Verification**: The back-end receives the `razorpay_signature` and verifies it using the Secret Key. Once verified, the status is updated to `captured`, and the corresponding order is finalized.

---

## 5. Code Logic Explanations

### CRUD Operations (Create, Read, Update, Delete)

The project uses **Mongoose (ODM)** to interact with MongoDB. A typical CRUD flow (e.g., for Products) looks like this:

- **Create**: Uses `app.post` with `multer` middleware to handle image uploads. A unique `pid` is generated using `Date.now()`, and the `new Product({...})` is saved to the database.
- **Read**: Uses `app.get` with `Product.find().sort({ createdAt: -1 })` to fetch all products in descending order of creation.
- **Update**: Uses `app.put` with `findOneAndUpdate` to find the specific `pid` and apply the new values from `req.body`.
- **Delete**: Uses `app.delete` with `findOneAndDelete` to remove the document matching the `pid`.

### Graph & Analytics Generation

The dashboard uses two distinct methods for visualizations:

1. **Pure CSS Graphs (Dashboard.jsx)**:
   - For a lightweight UI, the sales and visits charts are created using a `conic-gradient` background on a circular `div`.
   - _Example_: `background: conic-gradient(#0284c7 0% 85%, #ea580c 85% 100%)` creates a pie chart showing an 85/15 ratio.

2. **Recharts Library (Reports.jsx)**:
   - Used for advanced business reporting. The library provides high-level components like `<BarChart>`, `<PieChart>`, `<XAxis>`, and `<Tooltip>`.
   - Data is fetched from the `/api/reports` endpoint, which aggregates sales data by month and by staff.

### Sorting & Searching Logic

- **Back-end Sorting**: Most retrieval APIs are explicitly sorted at the database level using `.sort({ createdAt: -1 })`. This ensures the newest orders, products, or users always appear at the top.
- **Front-end Searching**: Tables and lists (like in the Admin Product or User pages) implement "Live Search." As the user types in a search box, the React state filters the display array using:
  `items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))`
- **Dynamic Sorting**: On pages like the Client Product listing, users can manually sort by price or popularity. This is handled by a frontend `useEffect` that re-orders the `products` state when the sort dropdown changes.

---

## 6. REST API Methods (The Four Pillars)

The communication between the frontend and backend is based on standard REST HTTP methods. Each method corresponds to a specific action in the project:

### 📥 GET (Read)

- **Role**: Fetch data from the database without changing anything.
- **In-Project Example**: `GET /api/products` retrieves the list of items for the store.
- **Used for**: Viewing categories, browsing services, checking order history, and loading dashboard stats.

### 📤 POST (Create)

- **Role**: Submit new data to the server to create a new entry.
- **In-Project Example**: `POST /api/register` creates a new user profile.
- **Used for**: Placing new orders, booking appointments, adding products (with images via Multer), and logging in.

### 📝 PUT (Update)

- **Role**: Modify an existing record in the database.
- **In-Project Example**: `PUT /api/admin/orders/:orderid/status` updates an order from "Pending" to "Completed."
- **Used for**: Updating user profile info, changing product stock levels, and approving postpone requests.

### 🗑️ DELETE (Remove)

- **Role**: Permanently remove a record from the database.
- **In-Project Example**: `DELETE /api/cart/:cartid` removes an item from the user's shopping cart.
- **Used for**: Deleting products from inventory, clearing carts, and removing categories.

---

// POST: api/products
app.post('/api/products', upload.single('pimg'), async (req, res) => {
try {
const { pname, price, pdesc, quantity, pcategory, psubcategory, company } = req.body;

        // 1. Auto-generate a unique ID for the product
        const pid = 'PROD' + Date.now();

        // 2. Create the Mongoose object (including the path to the uploaded image)
        const newProduct = new Product({
            pid,
            pname,
            price: Number(price),
            pimg: req.file ? '/uploads/' + req.file.filename : '', // Saved from Multer
            pdesc,
            pcategory: pcategory || '',
            psubcategory: psubcategory || '',
            company: company || '',
            quantity: Number(quantity)
        });

        // 3. Save to MongoDB
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });

    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ message: 'Server error adding product' });
    }

});
