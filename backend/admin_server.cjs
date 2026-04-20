require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const { User, Product, Cart, Category, Order, Service, Package, Appointment, Customer, MembershipPlan, Staff, Invoice, Feedback, ProductReview, Inquiry, Notification } = require('./models.cjs');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../client/uploads')));

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../client/uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/preetysalon')
    .then(async () => {
        console.log('✅ Connected to MongoDB - preetysalon database');
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// ===================== API ROUTES =====================

// Register a new user (no file uploads)
app.post('/api/register', async (req, res) => {
    try {
        const { uname, email, password, gender, contact } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Auto-generate userid
        const userid = 'USER' + Date.now();

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            userid,
            uname,
            email,
            password: hashedPassword,
            gender,
            contact
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const userData = {
            userid: user.userid,
            uname: user.uname,
            email: user.email,
            profilepic: user.profilepic,
            coverphoto: user.coverphoto,
            status: user.status,
            gender: user.gender,
            contact: user.contact
        };

        // Fetch associated customer data for membership
        if (user.contact) {
            const customer = await Customer.findOne({ phone: user.contact }).populate('membershipPlanId');
            if (customer) {
                userData.membershipStatus = customer.membershipStatus;
                userData.membershipTier = customer.membershipPlanId?.planName || null;
                userData.membershipExpiry = customer.membershipEndDate;
            }
        }

        res.status(200).json({ message: 'Login successful', user: userData });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// --- Forgot Password Logic ---

// Transporter (Mock for now, user needs to add real credentials)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Example
    port: 587,
    secure: false,
    auth: {
        user: 'preetysalon@gmail.com',
        pass: 'your-app-password'
    }
});

app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();

        console.log(`[OTP DEBUG] OTP for ${email}: ${otp}`);

        // Send Email
        const mailOptions = {
            from: '"Preety Salon" <preetysalon@gmail.com>',
            to: email,
            subject: 'Ritual Reset - Your Security Code',
            html: `
                <div style="font-family: 'Playfair Display', serif; padding: 40px; background: #fafaf9; color: #111;">
                    <h2 style="color: #666;">Ritual Security</h2>
                    <p style="font-size: 16px;">You requested a password reset for your Preety Salon account.</p>
                    <div style="background: #fff; padding: 20px; border: 1px solid #eee; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #111;">
                        ${otp}
                    </div>
                    <p style="margin-top: 20px; font-size: 14px; color: #888;">This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        // Attempt to send, but log failure so it doesn't crash the demo
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.warn('⚠️ Nodemailer: Real email failed (likely missing credentials). Use the debug log above.');
            } else {
                console.log('✅ OTP Email sent');
            }
        });

        res.status(200).json({ message: 'Security code dispatched to your email' });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Failed to dispatch security code' });
    }
});

app.post('/api/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ 
            email, 
            resetOtp: otp, 
            resetOtpExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired security code' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Clear OTP fields
        user.resetOtp = null;
        user.resetOtpExpires = null;
        
        await user.save();

        res.status(200).json({ message: 'Ritual password updated successfully' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Failed to update ritual password' });
    }
});

// Update profile pic or cover photo
app.post('/api/update-photo', upload.fields([
    { name: 'profilepic', maxCount: 1 },
    { name: 'coverphoto', maxCount: 1 }
]), async (req, res) => {
    try {
        const { email } = req.body;
        const updateData = {};

        if (req.files['profilepic']) {
            updateData.profilepic = '/uploads/' + req.files['profilepic'][0].filename;
        }
        if (req.files['coverphoto']) {
            updateData.coverphoto = '/uploads/' + req.files['coverphoto'][0].filename;
        }

        await User.findOneAndUpdate({ email }, updateData);
        res.status(200).json({ message: 'Photo updated', ...updateData });

    } catch (error) {
        console.error('Photo update error:', error);
        res.status(500).json({ message: 'Server error during photo update' });
    }
});

// Update profile info (name, contact, gender)
app.post('/api/update-profile', async (req, res) => {
    try {
        const { email, uname, contact, gender } = req.body;
        await User.findOneAndUpdate({ email }, { uname, contact, gender });
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Server error during profile update' });
    }
});

// Get membership status by phone
app.get('/api/user/membership/:phone', async (req, res) => {
    try {
        const customer = await Customer.findOne({ phone: req.params.phone }).populate('membershipPlanId');
        if (!customer) return res.status(404).json({ message: 'Customer record not found' });
        
        res.status(200).json({
            membershipStatus: customer.membershipStatus,
            membershipTier: customer.membershipPlanId?.planName || null,
            membershipExpiry: customer.membershipEndDate
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching membership info' });
    }
});

// ===================== USER MANAGEMENT =====================

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error('Fetch users error:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
});

// Block user
app.put('/api/users/:id/block', async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await User.findByIdAndUpdate(id, { status: 'blocked' }, { new: true });
        if (!updated) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User blocked successfully', user: updated });
    } catch (error) {
        console.error('Block user error:', error);
        res.status(500).json({ message: 'Server error blocking user' });
    }
});

// Unblock user
app.put('/api/users/:id/unblock', async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await User.findByIdAndUpdate(id, { status: 'active' }, { new: true });
        if (!updated) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User unblocked successfully', user: updated });
    } catch (error) {
        console.error('Unblock user error:', error);
        res.status(500).json({ message: 'Server error unblocking user' });
    }
});

// ===================== PRODUCT API ROUTES =====================

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
});

// Get single product by pid
app.get('/api/products/:pid', async (req, res) => {
    try {
        const product = await Product.findOne({ pid: req.params.pid });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Server error fetching product' });
    }
});

// Add new product (with image upload)
app.post('/api/products', upload.single('pimg'), async (req, res) => {
    try {
        const { pname, price, pdesc, quantity, pcategory, psubcategory, company } = req.body;

        // Auto-generate pid
        const pid = 'PROD' + Date.now();

        const newProduct = new Product({
            pid,
            pname,
            price: Number(price),
            pimg: req.file ? '/uploads/' + req.file.filename : '',
            pdesc,
            pcategory: pcategory || '',
            psubcategory: psubcategory || '',
            company: company || '',
            quantity: Number(quantity)
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });

    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ message: 'Server error adding product' });
    }
});

// Update product
app.put('/api/products/:pid', upload.single('pimg'), async (req, res) => {
    try {
        const { pname, price, pdesc, quantity, pcategory, psubcategory, company } = req.body;
        const updateData = { pname, price: Number(price), pdesc, quantity: Number(quantity), pcategory, psubcategory, company };

        if (req.file) {
            updateData.pimg = '/uploads/' + req.file.filename;
        }

        const updated = await Product.findOneAndUpdate(
            { pid: req.params.pid },
            updateData,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updated });

    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Server error updating product' });
    }
});

// Delete product
app.delete('/api/products/:pid', async (req, res) => {
    try {
        const deleted = await Product.findOneAndDelete({ pid: req.params.pid });
        if (!deleted) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
});

// ===================== CART API ROUTES =====================

// Add to Cart
app.post('/api/cart', async (req, res) => {
    try {
        const { userid, productid, quantity, price } = req.body;

        // Fetch product to verify stock
        const product = await Product.findOne({ pid: productid });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const cartid = 'CART' + Date.now();
        const numQty = Number(quantity);
        const totalamt = numQty * Number(price);

        const existingItem = await Cart.findOne({ userid, productid });
        if (existingItem) {
            if (existingItem.quantity + numQty > product.quantity) {
                return res.status(400).json({ message: 'Cannot add more items than available in stock' });
            }
            existingItem.quantity += numQty;
            existingItem.totalamt += totalamt;
            await existingItem.save();
            return res.status(200).json({ message: 'Cart updated', cart: existingItem });
        }

        const newCartItem = new Cart({
            cartid,
            productid,
            userid,
            quantity: numQty,
            totalamt
        });

        await newCartItem.save();
        res.status(201).json({ message: 'Product added to cart', cart: newCartItem });

    } catch (error) {
        console.error('Add cart EXACT error:', error.message, error.stack);
        res.status(500).json({ message: 'Server error adding to cart' });
    }
});

// Get user cart items
app.get('/api/cart/:userid', async (req, res) => {
    try {
        const { userid } = req.params;
        const cartItems = await Cart.find({ userid }).sort({ addedat: -1 });

        // Fetch corresponding product details for each cart item
        const populatedCart = await Promise.all(cartItems.map(async (item) => {
            const product = await Product.findOne({ pid: item.productid });
            return {
                ...item._doc,
                product: product || null
            };
        }));
        
        res.status(200).json(populatedCart);
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ message: 'Server error fetching cart' });
    }
});

// Delete cart item
app.delete('/api/cart/:cartid', async (req, res) => {
    try {
        const deleted = await Cart.findOneAndDelete({ cartid: req.params.cartid });
        if (!deleted) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Delete cart error:', error);
        res.status(500).json({ message: 'Server error deleting cart item' });
    }
});

// Update cart quantity
app.put('/api/cart/:cartid', async (req, res) => {
    try {
        const { action } = req.body;
        const cartItem = await Cart.findOne({ cartid: req.params.cartid });
        if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });

        const product = await Product.findOne({ pid: cartItem.productid });
        if (!product) return res.status(404).json({ message: 'Associated product not found' });

        const price = Number(product.price);
        let total = Number(cartItem.totalamt) || 0;
        const currentQty = Math.round(total / (price || 1));

        if (action === 'increase') {
            if (cartItem.quantity + 1 > product.quantity) {
                return res.status(400).json({ message: 'Cannot exceed available stock' });
            }
            cartItem.quantity += 1;
            cartItem.totalamt += price;
        } else if (action === 'decrease') {
            if (cartItem.quantity > 1) {
                cartItem.quantity -= 1;
                cartItem.totalamt -= price;
            } else {
                return res.status(400).json({ message: 'Minimum quantity is 1' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        await cartItem.save();
        res.status(200).json({ message: 'Cart updated', cart: cartItem });

    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ message: 'Server error updating cart' });
    }
});

// Start server
// ===================== CATEGORY ROUTES =====================

// Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Server error fetching categories' });
    }
});

// Add a new category
app.post('/api/categories', async (req, res) => {
    try {
        const { catname, catdesc, company, subcategories } = req.body;
        const catid = 'CAT' + Date.now();
        const newCategory = new Category({ 
            catid, 
            catname, 
            catdesc, 
            company: company || '', 
            subcategories: subcategories || [] 
        });
        await newCategory.save();
        res.status(201).json({ message: 'Category added successfully', category: newCategory });
    } catch (error) {
        console.error('Add category error:', error);
        res.status(500).json({ message: 'Server error adding category' });
    }
});

// Update a category
app.put('/api/categories/:catid', async (req, res) => {
    try {
        const { catname, catdesc, company, subcategories } = req.body;
        const updated = await Category.findOneAndUpdate(
            { catid: req.params.catid },
            { catname, catdesc, company, subcategories },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category updated successfully', category: updated });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ message: 'Server error updating category' });
    }
});

// Delete a category
app.delete('/api/categories/:catid', async (req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({ catid: req.params.catid });
        if (!deleted) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ message: 'Server error deleting category' });
    }
});

// ===================== ORDER API ROUTES =====================

// Create a new order
app.post('/api/orders', async (req, res) => {
    try {
        const { 
            userid, fullname, phone, email, location, 
            street, postalcode, paymentmethod, totalamount 
        } = req.body;

        const orderid = 'ORD' + Date.now();

        const newOrder = new Order({
            orderid,
            userid,
            fullname,
            phone,
            email,
            location,
            street,
            postalcode,
            paymentmethod,
            totalamount: Number(totalamount),
            status: 'Pending',
            paymentstatus: paymentmethod === 'COD' ? 'Pending' : 'Completed' // Simple logic for now
        });

        await newOrder.save();

        // Update product quantities from cart items
        const cartItems = await Cart.find({ userid });
        for (const item of cartItems) {
            const product = await Product.findOne({ pid: item.productid });
            if (product) {
                product.quantity -= item.quantity;
                if (product.quantity < 0) product.quantity = 0; // Guard against negative stock
                await product.save();
            }
        }

        // Clear the user's cart after successful order
        await Cart.deleteMany({ userid });

        // Create notification for admin
        const adminNotification = new Notification({
            recipientId: 'admin',
            type: 'order',
            title: 'New Order Placed',
            message: `A new order (${orderid}) has been placed by ${fullname}.`,
            link: '/orders'
        });
        await adminNotification.save();

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });

    } catch (error) {
        console.error('Order placement error:', error);
        res.status(500).json({ message: 'Server error during order placement' });
    }
});

// Get user orders
app.get('/api/orders/:userid', async (req, res) => {
    try {
        const { userid } = req.params;
        const orders = await Order.find({ userid }).sort({ orderdate: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
});

// Get all orders (for admin)
app.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderdate: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Admin get orders error:', error);
        res.status(500).json({ message: 'Server error fetching all orders' });
    }
});

// Update order status (for admin)
app.put('/api/admin/orders/:orderid/status', async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await Order.findOneAndUpdate(
            { orderid: req.params.orderid },
            { status },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Order not found' });

        // Create notification for client
        const userNotification = new Notification({
            recipientId: updated.userid,
            type: 'order',
            title: 'Order Status Updated',
            message: `Your order (${updated.orderid}) status has been updated to: ${status}.`,
            link: '/profile'
        });
        await userNotification.save();

        res.status(200).json({ message: 'Order status updated', order: updated });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error updating order status' });
    }
});

// ===================== SERVICE API ROUTES =====================

// Get all services
app.get('/api/services', async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({ message: 'Server error fetching services' });
    }
});

// Add a new service
app.post('/api/services', async (req, res) => {
    try {
        let { title, subtitle, gender, items } = req.body;
        
        // Items will be stringified JSON when sent via FormData or regular JSON
        if (typeof items === 'string') {
            try { items = JSON.parse(items); } catch (e) { items = []; }
        }

        const sid = 'SERV' + Date.now();
        
        const newService = new Service({ sid, title, subtitle, gender, items });
        await newService.save();
        res.status(201).json({ message: 'Service added successfully', service: newService });
    } catch (error) {
        console.error('Add service error:', error);
        res.status(500).json({ message: 'Server error adding service' });
    }
});

// Update a service
app.put('/api/services/:sid', async (req, res) => {
    try {
        let { title, subtitle, gender, items } = req.body;

        if (typeof items === 'string') {
            try { items = JSON.parse(items); } catch (e) { items = []; }
        }

        const updateData = { title, subtitle, gender, items };

        const updated = await Service.findOneAndUpdate(
            { sid: req.params.sid },
            updateData,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Service not found' });
        res.status(200).json({ message: 'Service updated successfully', service: updated });
    } catch (error) {
        console.error('Update service error:', error);
        res.status(500).json({ message: 'Server error updating service' });
    }
});

// Delete a service
app.delete('/api/services/:sid', async (req, res) => {
    try {
        const deleted = await Service.findOneAndDelete({ sid: req.params.sid });
        if (!deleted) return res.status(404).json({ message: 'Service not found' });
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Delete service error:', error);
        res.status(500).json({ message: 'Server error deleting service' });
    }
});

// ===================== PACKAGE API ROUTES =====================

// Get all active packages (for client)
app.get('/api/packages', async (req, res) => {
    try {
        const packages = await Package.find({ status: 'active' }).sort({ createdAt: -1 });
        res.status(200).json(packages);
    } catch (error) {
        console.error('Get packages error:', error);
        res.status(500).json({ message: 'Server error fetching packages' });
    }
});

// Get all packages (for admin)
app.get('/api/admin/packages', async (req, res) => {
    try {
        const packages = await Package.find().sort({ createdAt: -1 });
        res.status(200).json(packages);
    } catch (error) {
        console.error('Admin get packages error:', error);
        res.status(500).json({ message: 'Server error fetching all packages' });
    }
});

// Add new package (with optional image upload)
app.post('/api/packages', upload.single('pkimg'), async (req, res) => {
    try {
        const { pkname, pkprice, pkdesc, pkfeatures, status } = req.body;
        const pkid = 'PK' + Date.now();

        const newPackage = new Package({
            pkid,
            pkname,
            pkprice: Number(pkprice),
            pkdesc,
            pkfeatures: Array.isArray(pkfeatures) ? pkfeatures : JSON.parse(pkfeatures || '[]'),
            pkimg: req.file ? '/uploads/' + req.file.filename : '',
            status: status || 'active'
        });

        await newPackage.save();
        res.status(201).json({ message: 'Package added successfully', package: newPackage });
    } catch (error) {
        console.error('Add package error:', error);
        res.status(500).json({ message: 'Server error adding package' });
    }
});

// Update package
app.put('/api/packages/:pkid', upload.single('pkimg'), async (req, res) => {
    try {
        const { pkname, pkprice, pkdesc, pkfeatures, status } = req.body;
        const updateData = {
            pkname,
            pkprice: Number(pkprice),
            pkdesc,
            pkfeatures: Array.isArray(pkfeatures) ? pkfeatures : JSON.parse(pkfeatures || '[]'),
            status: status || 'active'
        };

        if (req.file) {
            updateData.pkimg = '/uploads/' + req.file.filename;
        }

        const updated = await Package.findOneAndUpdate(
            { pkid: req.params.pkid },
            updateData,
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: 'Package not found' });
        res.status(200).json({ message: 'Package updated successfully', package: updated });
    } catch (error) {
        console.error('Update package error:', error);
        res.status(500).json({ message: 'Server error updating package' });
    }
});

// Delete package
app.delete('/api/packages/:pkid', async (req, res) => {
    try {
        const deleted = await Package.findOneAndDelete({ pkid: req.params.pkid });
        if (!deleted) return res.status(404).json({ message: 'Package not found' });
        res.status(200).json({ message: 'Package deleted successfully' });
    } catch (error) {
        console.error('Delete package error:', error);
        res.status(500).json({ message: 'Server error deleting package' });
    }
});

// ===================== APPOINTMENT API ROUTES =====================

// Add new appointment
app.post('/api/appointments', async (req, res) => {
    try {
        const { userid, service, date, time, guestName, email, phone, specialWishes } = req.body;
        const appid = 'APP' + Date.now();

        const newAppointment = new Appointment({
            appid,
            userid,
            service,
            date,
            time,
            guestName,
            email,
            phone,
            specialWishes
        });

        await newAppointment.save();

        // Create notification for admin
        const adminNotification = new Notification({
            recipientId: 'admin',
            type: 'appointment',
            title: 'New Appointment Booked',
            message: `${guestName} has booked an appointment for ${service} on ${date} at ${time}.`,
            link: '/appointments'
        });
        await adminNotification.save();

        res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
    } catch (error) {
        console.error('Book appointment error:', error);
        res.status(500).json({ message: 'Server error booking appointment' });
    }
});

// Get user appointments
app.get('/api/appointments/:userid', async (req, res) => {
    try {
        const { userid } = req.params;
        const appointments = await Appointment.find({ userid }).sort({ createdAt: -1 });
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ message: 'Server error fetching appointments' });
    }
});

// Admin: Get all appointments
app.get('/api/all-appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find({}).sort({ createdAt: -1 });
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Get all appointments error:', error);
        res.status(500).json({ message: 'Server error fetching all appointments' });
    }
});

// Admin: Update appointment status
app.put('/api/appointments/:appid/status', async (req, res) => {
    try {
        const { appid } = req.params;
        const { status } = req.body;

        const appointment = await Appointment.findOneAndUpdate(
            { appid },
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Create notification for client
        const userNotification = new Notification({
            recipientId: appointment.userid,
            type: 'appointment',
            title: 'Appointment Status Updated',
            message: `Your appointment for ${Array.isArray(appointment.service) ? appointment.service.join(', ') : appointment.service} has been updated to: ${status}.`,
            link: '/profile'
        });
        await userNotification.save();

        res.status(200).json({ message: 'Status updated successfully', appointment });
    } catch (error) {
        console.error('Update appointment status error:', error);
        res.status(500).json({ message: 'Server error updating appointment status' });
    }
});

// POSTPONE ROUTES
// Client: Request postponement
app.post('/api/appointments/:appid/postpone-request', async (req, res) => {
    try {
        const { appid } = req.params;
        const { newDate, newTime } = req.body;

        const appointment = await Appointment.findOneAndUpdate(
            { appid },
            { 
                postponeRequest: { 
                    newDate, 
                    newTime, 
                    status: 'Pending' 
                } 
            },
            { new: true }
        );

        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Notify admin
        const adminNotification = new Notification({
            recipientId: 'admin',
            type: 'appointment',
            title: 'Postponement Request',
            message: `${appointment.guestName} requested to postpone their appointment to ${newDate} at ${newTime}.`,
            link: '/appointments'
        });
        await adminNotification.save();

        res.status(200).json({ message: 'Postponement request sent', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Server error requesting postponement' });
    }
});

// Admin: Approve postponement
app.post('/api/appointments/:appid/approve-postpone', async (req, res) => {
    try {
        const { appid } = req.params;
        const appointment = await Appointment.findOne({ appid });

        if (!appointment || !appointment.postponeRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const { newDate, newTime } = appointment.postponeRequest;

        appointment.date = newDate;
        appointment.time = newTime;
        appointment.postponeRequest.status = 'Approved';
        await appointment.save();

        // Notify client
        const userNotification = new Notification({
            recipientId: appointment.userid,
            type: 'appointment',
            title: 'Postponement Approved',
            message: `Your appointment postponement to ${newDate} at ${newTime} has been approved.`,
            link: '/profile'
        });
        await userNotification.save();

        res.status(200).json({ message: 'Postponement approved', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Server error approving postponement' });
    }
});

// Admin: Reject postponement
app.post('/api/appointments/:appid/reject-postpone', async (req, res) => {
    try {
        const { appid } = req.params;
        const appointment = await Appointment.findOne({ appid });

        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.postponeRequest.status = 'Rejected';
        await appointment.save();

        // Notify client
        const userNotification = new Notification({
            recipientId: appointment.userid,
            type: 'appointment',
            title: 'Postponement Declined',
            message: `Your postponement request for your appointment has been declined. Please stick to the original schedule or contact us.`,
            link: '/profile'
        });
        await userNotification.save();

        res.status(200).json({ message: 'Postponement rejected', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Server error rejecting postponement' });
    }
});

// Admin: Direct Postponement (Manual Edit)
app.put('/api/appointments/:appid/direct-postpone', async (req, res) => {
    try {
        const { appid } = req.params;
        const { date, time } = req.body;

        const appointment = await Appointment.findOneAndUpdate(
            { appid },
            { date, time, 'postponeRequest.status': null },
            { new: true }
        );

        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Notify client
        const userNotification = new Notification({
            recipientId: appointment.userid,
            type: 'appointment',
            title: 'Appointment Rescheduled',
            message: `Your appointment has been rescheduled by the admin to ${date} at ${time}.`,
            link: '/profile'
        });
        await userNotification.save();

        res.status(200).json({ message: 'Appointment rescheduled successfully', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Server error rescheduling appointment' });
    }
});

// ===================== ADMIN DASHBOARD STATS =====================
app.get('/api/admin/dashboard-stats', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // 1. Sales Calculations
        const invoiceSales = await Invoice.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);
        const orderSales = await Order.aggregate([
            { $match: { status: { $ne: "Cancelled" } } },
            { $group: { _id: null, total: { $sum: "$totalamount" } } }
        ]);
        const totalSales = (invoiceSales[0]?.total || 0) + (orderSales[0]?.total || 0);

        // 2. Services vs Products Sales Breakdown
        const servicesSalesAgg = await Invoice.aggregate([
            { $unwind: "$items" },
            { $match: { "items.type": "service", status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$items.amount" } } }
        ]);
        const inStoreProductsSalesAgg = await Invoice.aggregate([
            { $unwind: "$items" },
            { $match: { "items.type": "product", status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$items.amount" } } }
        ]);
        
        const servicesSales = servicesSalesAgg[0]?.total || 0;
        const productsSales = (inStoreProductsSalesAgg[0]?.total || 0) + (orderSales[0]?.total || 0);

        // 3. Visits Breakdown (Appointments)
        const appointments = await Appointment.find();
        const visitsBreakdown = {
            total: appointments.length,
            upcoming: appointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length,
            completed: appointments.filter(a => a.status === 'Done' || a.status === 'Completed').length,
            cancelled: appointments.filter(a => a.status === 'Cancelled').length,
            noShow: appointments.filter(a => a.status === 'NoShow' || a.status === 'Other').length
        };

        // 4. Recent Invoices
        const recentInvoices = await Invoice.find().sort({ date: -1 }).limit(5);

        // 5. Today's Appointments
        // Since Appointment.date is a String (e.g., "2026-03-12"), we search for current date string
        const todaysAppointments = await Appointment.find({ date: today }).limit(10);

        res.status(200).json({
            totalSales,
            servicesSales,
            productsSales,
            visitsBreakdown,
            recentInvoices,
            todaysAppointments
        });
    } catch (error) {
        console.error('Fetch dashboard stats error:', error);
        res.status(500).json({ message: 'Server error fetching dashboard statistics' });
    }
});

// ==========================================
// REPORTS ROUTES
// Get aggregated data for the admin reports dashboard
app.get('/api/reports', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1);
        const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

        // 1. Staff Performance Pipeline
        const staffReports = await Invoice.aggregate([
            { $unwind: "$items" },
            { $match: { "items.staffId": { $ne: "" }, "items.staffId": { $ne: null } } },
            { 
                $group: {
                    _id: "$items.staffId",
                    staffName: { $first: "$items.staffName" },
                    totalServices: { $sum: 1 },
                    totalRevenue: { $sum: "$items.amount" }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        // 2. Products Sold Pipeline (from Invoices & Orders)
        // Part A: Products sold in-store (from Invoices)
        const invoiceProducts = await Invoice.aggregate([
            { $unwind: "$items" },
            { $match: { "items.type": "product" } },
            {
                $group: {
                    _id: "$items.serviceName", // Product name stored here
                    productName: { $first: "$items.serviceName" },
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: "$items.amount" }
                }
            }
        ]);

        // Part B: Total Online Orders Summary (Orders don't store line items directly)
        const onlineOrdersSummary = await Order.aggregate([
            { $match: { status: { $ne: "Cancelled" } } },
            {
                $group: {
                    _id: "Online Orders (Total)",
                    productName: { $first: "Online Orders Summary" },
                    totalQuantity: { $sum: 1 }, // Treating 1 order as 1 'unit' since items aren't stored
                    totalRevenue: { $sum: "$totalamount" }
                }
            }
        ]);

        const productReports = [...invoiceProducts, ...onlineOrdersSummary];

        // 3. Yearly Report Pipeline (Monthly Revenue)
        // Group Invoices by Month
        const invoiceMonthly = await Invoice.aggregate([
            { $match: { date: { $gte: startOfYear, $lte: endOfYear } } },
            {
                $group: {
                    _id: { $month: "$date" },
                    revenue: { $sum: "$total" }
                }
            }
        ]);

        // Group Orders by Month
        const orderMonthly = await Order.aggregate([
            { $match: { orderdate: { $gte: startOfYear, $lte: endOfYear } } },
            {
                $group: {
                    _id: { $month: "$orderdate" },
                    revenue: { $sum: "$totalamount" }
                }
            }
        ]);

        // Merge monthly data into 1-12 array format
        const yearlyReport = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            monthName: new Date(0, i).toLocaleString('en', { month: 'short' }),
            inStoreRevenue: 0,
            onlineRevenue: 0,
            totalRevenue: 0
        }));

        invoiceMonthly.forEach(item => {
            yearlyReport[item._id - 1].inStoreRevenue = item.revenue;
            yearlyReport[item._id - 1].totalRevenue += item.revenue;
        });

        orderMonthly.forEach(item => {
            yearlyReport[item._id - 1].onlineRevenue = item.revenue;
            yearlyReport[item._id - 1].totalRevenue += item.revenue;
        });

        // 4. Detailed Transactions List (Last 200 items for granular reporting)
        const detailedInvoices = await Invoice.aggregate([
            { $unwind: "$items" },
            { $sort: { date: -1 } },
            { $limit: 200 },
            {
                $project: {
                    _id: 0,
                    date: 1,
                    customerName: 1,
                    itemName: "$items.serviceName",
                    price: "$items.price",
                    quantity: "$items.quantity",
                    amount: "$items.amount",
                    staffName: "$items.staffName",
                    type: "$items.type",
                    source: { $literal: "In-Store" }
                }
            }
        ]);

        const detailedOrders = await Order.find({ status: { $ne: "Cancelled" } })
            .sort({ orderdate: -1 })
            .limit(100)
            .lean();
        
        const formattedOrders = detailedOrders.map(order => ({
            date: order.orderdate,
            customerName: order.fullname,
            itemName: "Online Order",
            price: order.totalamount,
            quantity: 1,
            amount: order.totalamount,
            staffName: "N/A",
            type: "order",
            source: "Online"
        }));

        const detailedTransactions = [...detailedInvoices, ...formattedOrders]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 200);

        res.status(200).json({
            staffReports,
            productReports,
            yearlyReport,
            detailedTransactions
        });

    } catch (error) {
        console.error('Fetch reports error:', error);
        res.status(500).json({ message: 'Server error aggregating reports' });
    }
});

// ==========================================
// CUSTOMER ROUTES
// Get invoices for a specific customer
app.get('/api/customers/:id/invoices', async (req, res) => {
    try {
        const invoices = await Invoice.find({ customerId: req.params.id }).sort({ date: -1, createdAt: -1 });
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Fetch customer invoices error:', error);
        res.status(500).json({ message: 'Server error fetching invoices for customer' });
    }
});

// ==========================================

// Get all customers
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find().populate('membershipPlanId').sort({ createdAt: -1 });
        res.status(200).json(customers);
    } catch (error) {
        console.error('Fetch customers error:', error);
        res.status(500).json({ message: 'Server error fetching customers', error: error.message, stack: error.stack });
    }
});

// Create new customer
app.post('/api/customers', async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        
        // Basic validation
        if (!name || !phone) {
            return res.status(400).json({ message: 'Name and phone are required' });
        }

        const newCustomer = new Customer({ name, phone, email });
        const savedCustomer = await newCustomer.save();
        
        res.status(201).json(savedCustomer);
    } catch (error) {
        console.error('Create customer error:', error);
        res.status(500).json({ message: 'Server error creating customer' });
    }
});

// Update customer
app.put('/api/customers/:id', async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, phone, email },
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(updatedCustomer);
    } catch (error) {
        console.error('Update customer error:', error);
        res.status(500).json({ message: 'Server error updating customer' });
    }
});

// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        
        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Delete customer error:', error);
        res.status(500).json({ message: 'Server error deleting customer' });
    }
});

// ==========================================
// FEEDBACK ROUTES
// ==========================================

// Get all services a user has availed (from their invoices by phone)
app.get('/api/feedback/my-services/:phone', async (req, res) => {
    try {
        // Find invoices for this customer by phone
        const invoices = await Invoice.find({ customerPhone: req.params.phone, status: { $ne: 'Cancelled' } }).sort({ date: -1 });
        // Flatten unique service names
        const serviceMap = {};
        invoices.forEach(inv => {
            inv.items.forEach(item => {
                if (item.type !== 'product' && item.serviceName) {
                    const key = item.serviceName;
                    // We take the latest occurrence of the service if it hasn't been added yet
                    if (!serviceMap[key]) {
                        serviceMap[key] = { 
                            serviceName: item.serviceName, 
                            invoiceId: inv._id, 
                            invoiceDate: inv.date,
                            staffId: item.staffId || '',
                            staffName: item.staffName || ''
                        };
                    }
                }
            });
        });
        res.status(200).json(Object.values(serviceMap));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services' });
    }
});

// Get feedback submitted by a user
app.get('/api/feedback/by-user/:userId', async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback' });
    }
});

// Submit or update feedback
app.post('/api/feedback', async (req, res) => {
    try {
        const { userId, userName, serviceName, rating, comment, invoiceId, staffId, staffName } = req.body;
        
        // Use "General Staff Review" if no service provided (for direct staff reviews)
        const finalServiceName = serviceName || "General Staff Review";

        // Upsert: one feedback per user per (service OR staff if no service)
        // If it's a direct staff review, we upsert based on userId and staffId
        const query = serviceName ? { userId, serviceName } : { userId, staffId, serviceName: "General Staff Review" };

        const existing = await Feedback.findOne(query);
        if (existing) {
            existing.rating = rating;
            existing.comment = comment;
            existing.staffId = staffId || existing.staffId;
            existing.staffName = staffName || existing.staffName;
            await existing.save();
            return res.status(200).json(existing);
        }
        const feedback = new Feedback({ 
            userId, 
            userName, 
            serviceName: finalServiceName, 
            rating, 
            comment, 
            invoiceId, 
            staffId, 
            staffName 
        });
        await feedback.save();

        // Create notification for admin
        const adminNotification = new Notification({
            recipientId: 'admin',
            type: 'feedback',
            title: 'New Service Feedback',
            message: `${userName} has submitted a ${rating}-star feedback for ${finalServiceName}.`,
            link: '/feedback'
        });
        await adminNotification.save();

        res.status(201).json(feedback);
    } catch (error) {
        console.error('Save feedback error:', error);
        res.status(500).json({ message: 'Error saving feedback' });
    }
});

// Get all feedback (admin view)
app.get('/api/feedback', async (req, res) => {
    try {
        const all = await Feedback.find().sort({ createdAt: -1 });
        res.status(200).json(all);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all feedback' });
    }
});

// ==========================================
// MEMBERSHIP PLAN ROUTES
// ==========================================

// Get all membership plans (public endpoint for client)
app.get('/api/membership-plans', async (req, res) => {
    try {
        const plans = await MembershipPlan.find().sort({ price: 1 });
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create plan
app.post('/api/membership-plans', async (req, res) => {
    try {
        const plan = new MembershipPlan(req.body);
        const saved = await plan.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating plan' });
    }
});

// Update plan
app.put('/api/membership-plans/:id', async (req, res) => {
    try {
        const updated = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating plan' });
    }
});

// Delete plan
app.delete('/api/membership-plans/:id', async (req, res) => {
    try {
        await MembershipPlan.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Plan deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting plan' });
    }
});

// Activate membership for a customer
app.post('/api/customers/:id/activate-membership', async (req, res) => {
    try {
        const { planId } = req.body;
        const plan = await MembershipPlan.findById(planId);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + plan.durationMonths);

        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            membershipStatus: 'Active',
            membershipPlanId: planId,
            membershipStartDate: startDate.toISOString().split('T')[0],
            membershipEndDate: endDate.toISOString().split('T')[0]
        }, { new: true }).populate('membershipPlanId');

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Server error activating membership' });
    }
});

// Deactivate membership
app.post('/api/customers/:id/deactivate-membership', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            membershipStatus: 'Inactive',
            membershipPlanId: null,
            membershipStartDate: '',
            membershipEndDate: ''
        }, { new: true });
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Server error deactivating membership' });
    }
});

// Get all customers with active memberships
app.get('/api/members', async (req, res) => {
    try {
        const members = await Customer.find({ membershipStatus: 'Active' })
            .populate('membershipPlanId')
            .sort({ membershipEndDate: 1 });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching members' });
    }
});

// ==========================================
// STAFF ROUTES
// ==========================================

// Get all staff
app.get('/api/staff', async (req, res) => {
    try {
        const staff = await Staff.find().sort({ createdAt: -1 });
        res.status(200).json(staff);
    } catch (error) {
        console.error('Fetch staff error:', error);
        res.status(500).json({ message: 'Server error fetching staff' });
    }
});

// Create new staff
app.post('/api/staff', upload.single('image'), async (req, res) => {
    try {
        const staffData = { ...req.body };
        if (req.file) staffData.image = req.file.filename;
        // Parse services if sent as JSON string
        if (typeof staffData.services === 'string') {
            try { staffData.services = JSON.parse(staffData.services); } catch(e) { staffData.services = []; }
        }
        const newStaff = new Staff(staffData);
        const savedStaff = await newStaff.save();
        res.status(201).json(savedStaff);
    } catch (error) {
        console.error('Create staff error:', error);
        res.status(500).json({ message: 'Server error creating staff' });
    }
});

// Update staff
app.put('/api/staff/:id', upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) updateData.image = req.file.filename;
        // Parse services if sent as JSON string
        if (typeof updateData.services === 'string') {
            try { updateData.services = JSON.parse(updateData.services); } catch(e) { updateData.services = []; }
        }
        const updatedStaff = await Staff.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!updatedStaff) return res.status(404).json({ message: 'Staff not found' });
        res.status(200).json(updatedStaff);
    } catch (error) {
        console.error('Update staff error:', error);
        res.status(500).json({ message: 'Server error updating staff' });
    }
});

// Delete staff
app.delete('/api/staff/:id', async (req, res) => {
    try {
        const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
        if (!deletedStaff) return res.status(404).json({ message: 'Staff not found' });
        res.status(200).json({ message: 'Staff deleted successfully' });
    } catch (error) {
        console.error('Delete staff error:', error);
        res.status(500).json({ message: 'Server error deleting staff' });
    }
});

// Get single staff by ID
app.get('/api/staff/:id', async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) return res.status(404).json({ message: 'Staff not found' });
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching staff details' });
    }
});

// Get feedback for a specific staff member
app.get('/api/feedback/by-staff/:staffId', async (req, res) => {
    try {
        const reviews = await Feedback.find({ staffId: req.params.staffId }).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching staff reviews' });
    }
});

// Get staff analytics: overall rating and recommended services
app.get('/api/staff/:id/stats', async (req, res) => {
    try {
        const staffId = req.params.id;
        const reviews = await Feedback.find({ staffId });
        
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
            : 0;

        // Calculate frequency of services and their average ratings
        const serviceStats = {};
        reviews.forEach(r => {
            if (!serviceStats[r.serviceName]) {
                serviceStats[r.serviceName] = { count: 0, totalRating: 0 };
            }
            serviceStats[r.serviceName].count += 1;
            serviceStats[r.serviceName].totalRating += r.rating;
        });

        const recommendations = Object.keys(serviceStats).map(name => ({
            name,
            avgRating: (serviceStats[name].totalRating / serviceStats[name].count).toFixed(1),
            reviewCount: serviceStats[name].count
        })).sort((a,b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount)
        .slice(0, 3);

        res.status(200).json({
            avgRating,
            reviewCount: reviews.length,
            recommendations
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching staff stats' });
    }
});

// ==========================================
// INVOICE ROUTES
// ==========================================

// Get all invoices
app.get('/api/invoices', async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('customerId', 'name phone email')
            .sort({ date: -1, createdAt: -1 });
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Fetch invoices error:', error);
        res.status(500).json({ message: 'Server error fetching invoices' });
    }
});

// Get invoices by customer phone (for client profile page)
app.get('/api/invoices/by-phone/:phone', async (req, res) => {
    try {
        const invoices = await Invoice.find({ customerPhone: req.params.phone })
            .sort({ date: -1, createdAt: -1 });
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Fetch invoices by phone error:', error);
        res.status(500).json({ message: 'Server error fetching invoices' });
    }
});

// Get single invoice
app.get('/api/invoices/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('customerId', 'name phone email');
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json(invoice);
    } catch (error) {
        console.error('Fetch single invoice error:', error);
        res.status(500).json({ message: 'Server error fetching invoice' });
    }
});

// Create new invoice
app.post('/api/invoices', async (req, res) => {
    try {
        const invoiceData = req.body;
        
        // Ensure invoiceNumber is unique
        let invoiceNumber = invoiceData.invoiceNumber;
        if (!invoiceNumber) {
            const count = await Invoice.countDocuments();
            invoiceNumber = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
        }
        
        const newInvoice = new Invoice({
            ...invoiceData,
            invoiceNumber
        });
        
        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        console.error('Create invoice error:', error);
        res.status(500).json({ message: 'Server error creating invoice', error: error.message });
    }
});

// Update invoice
app.put('/api/invoices/:id', async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json(updatedInvoice);
    } catch (error) {
        console.error('Update invoice error:', error);
        res.status(500).json({ message: 'Server error updating invoice' });
    }
});

// Delete invoice
app.delete('/api/invoices/:id', async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        
        if (!deletedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Delete invoice error:', error);
        res.status(500).json({ message: 'Server error deleting invoice' });
    }
});

// ==========================================
// DASHBOARD STATS
// ==========================================
app.get('/api/admin/dashboard-stats', async (req, res) => {
    try {
        const invoices = await Invoice.find();
        const totalSales = invoices.reduce((sum, inv) => sum + (inv.paidAmount || (inv.status === 'Paid' ? inv.total : 0)), 0);
        
        // Mocked breakdown - in a real app, you'd track this per item
        const servicesSales = totalSales * 0.85; 
        const productsSales = totalSales * 0.15;

        const appointments = await Appointment.find();
        const visitsBreakdown = {
            total: appointments.length,
            upcoming: appointments.filter(a => a.status === 'Pending').length,
            completed: appointments.filter(a => a.status === 'Completed').length,
            noShow: appointments.filter(a => a.status === 'No Show' || a.status === 'noShow').length,
            cancelled: appointments.filter(a => a.status === 'Cancelled').length
        };

        const recentInvoices = await Invoice.find().sort({ createdAt: -1 }).limit(3).populate('customerId');

        // Today's appointments (format matches YYYY-MM-DD)
        const todayStr = new Date().toISOString().split('T')[0];
        const todaysAppointments = await Appointment.find({ date: todayStr }).sort({ time: 1 });

        res.status(200).json({
            totalSales,
            servicesSales,
            productsSales,
            visitsBreakdown,
            recentInvoices,
            todaysAppointments
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server error fetching dashboard stats' });
    }
});


// ==========================================
// PRODUCT REVIEW ROUTES
// ==========================================

// Get all reviews for a product
app.get('/api/product-reviews/:productId', async (req, res) => {
    try {
        const reviews = await ProductReview.find({ productId: req.params.productId }).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews' });
    }
});

// Submit or update a product review
app.post('/api/product-reviews', async (req, res) => {
    try {
        const { productId, userId, userName, rating, comment } = req.body;
        const existing = await ProductReview.findOne({ productId, userId });
        if (existing) {
            existing.rating = rating;
            existing.comment = comment;
            await existing.save();
            return res.status(200).json(existing);
        }
        const review = new ProductReview({ productId, userId, userName, rating, comment });
        await review.save();

        // Create notification for admin
        const adminNotification = new Notification({
            recipientId: 'admin',
            type: 'review',
            title: 'New Product Review',
            message: `${userName} has submitted a ${rating}-star review for product ${productId}.`,
            link: '/products' // or dedicated reviews page if exists
        });
        await adminNotification.save();

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error saving review' });
    }
});

// ==========================================
// INQUIRY ROUTES
// ==========================================

// Create new inquiry
app.post('/api/inquiries', async (req, res) => {
    try {
        const { fullname, email, phone, service, message } = req.body;
        const newInquiry = new Inquiry({ fullname, email, phone, service, message });
        await newInquiry.save();

        // Create notification for admin
        const adminNotification = new Notification({
            recipientId: 'admin',
            type: 'inquiry',
            title: 'New Inquiry Received',
            message: `${fullname} has sent a new inquiry regarding ${Array.isArray(service) ? service.join(', ') : (service || 'General Services')}.`,
            link: '/inquiries'
        });
        await adminNotification.save();

        res.status(201).json({ message: 'Inquiry sent successfully', inquiry: newInquiry });
    } catch (error) {
        console.error('Inquiry error:', error);
        res.status(500).json({ message: 'Server error sending inquiry' });
    }
});

// Admin: Get all inquiries
app.get('/api/admin/inquiries', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.status(200).json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inquiries' });
    }
});

// Admin: Update inquiry status
app.put('/api/admin/inquiries/:id', async (req, res) => {
    try {
        const updated = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating inquiry' });
    }
});

// ==========================================
// NOTIFICATION ROUTES
// ==========================================

// Get notifications for a recipient (admin or specific userId)
app.get('/api/notifications/:recipientId', async (req, res) => {
    try {
        const notifications = await Notification.find({ recipientId: req.params.recipientId }).sort({ createdAt: -1 }).limit(50);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

// Mark notification as read
app.put('/api/notifications/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification' });
    }
});

// Mark all as read
app.put('/api/notifications/read-all/:recipientId', async (req, res) => {
    try {
        await Notification.updateMany({ recipientId: req.params.recipientId, isRead: false }, { isRead: true });
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notifications' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
