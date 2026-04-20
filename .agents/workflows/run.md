---
description: Run the Preety Salon project including Database, Backend, and Frontends
---

Follow these steps to ensure the project is running with all data properly loaded:

1. **Start MongoDB**: 
// turbo
   `mongod --dbpath "d:\PREETY SALON\db"`
   Make sure this command stays running in the background.

2. **Start the Project Services**:
// turbo
   `npm start`
   This will concurrently start:
   - Client Frontend (http://localhost:5173)
   - Admin Dashboard (http://localhost:5174)
   - Client API (http://localhost:5000)
   - Admin API (http://localhost:5001)

3. **Verify Data**:
   Check [http://localhost:5173/api/products](http://localhost:5173/api/products) or [http://localhost:5000/api/products](http://localhost:5000/api/products) to ensure the backend is fetching data from the MongoDB instance.
