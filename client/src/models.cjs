const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
        unique: true
    },
    uname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilepic: {
        type: String,
        default: ''
    },
    coverphoto: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'active'
    },
    gender: {
        type: String,
        default: ''
    },
    contact: {
        type: String,
        default: ''
    },
    resetOtp: {
        type: String,
        default: null
    },
    resetOtpExpires: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
    pid: { type: String, required: true, unique: true },
    pname: { type: String, required: true },
    price: { type: Number, required: true },
    pimg: { type: String, required: true },
    pdesc: { type: String, required: true },
    pcategory: { type: String, default: '' },
    quantity: { type: Number, required: true }
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
    catid: { type: String, required: true, unique: true },
    catname: { type: String, required: true },
    catdesc: { type: String, default: '' }
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
    orderid: { type: String, required: true, unique: true },
    userid: { type: String, required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    location: { type: String },
    street: { type: String, required: true },
    postalcode: { type: String, required: true },
    paymentmethod: { type: String, required: true },
    totalamount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    paymentstatus: { type: String, default: 'Pending' },
    orderdate: { type: Date, default: Date.now }
}, { timestamps: true });

const CartSchema = new mongoose.Schema({
    cartid: { type: String, required: true, unique: true },
    productid: { type: String, required: true },
    userid: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    addedat: { type: Date, default: Date.now },
    totalamt: { type: Number, required: true }
}, { timestamps: true });

const ServiceSchema = new mongoose.Schema({
    sid: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String, default: '' },
    gender: { type: String, enum: ['women', 'men'], required: true },
    items: [{
        name: { type: String, required: true },
        price: { type: String, required: true },
        duration: { type: String, required: true },
        varieties: [{
            vname: { type: String },
            vprice: { type: String }
        }]
    }]
}, { timestamps: true });

const PackageSchema = new mongoose.Schema({
    pkid: { type: String, required: true, unique: true },
    pkname: { type: String, required: true },
    pkprice: { type: Number, required: true },
    pkimg: { type: String, default: '' },
    pkdesc: { type: String, required: true },
    pkfeatures: [{ type: String }], // List of features/services included
    status: { type: String, default: 'active' }
}, { timestamps: true });

const AppointmentSchema = new mongoose.Schema({
    appid: { type: String, required: true, unique: true },
    userid: { type: String, required: true },
    service: [String],
    date: { type: String, required: true },
    time: { type: String, required: true },
    guestName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    specialWishes: { type: String },
    status: { type: String, default: 'Pending' },
    postponeRequest: {
        newDate: { type: String },
        newTime: { type: String },
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected', null], default: null }
    }
}, { timestamps: true });

const MembershipPlanSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // Percentage discount for this tier
  durationMonths: { type: Number, required: true },
  benefits: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: "" },
  gender: { type: String, default: "" },
  birthday: { type: String, default: "" },
  anniversary: { type: String, default: "" },
  promotionalSMS: { type: Boolean, default: true },
  notes: { type: String, default: "" },
  membershipStatus: { type: String, default: "Inactive" },
  membershipPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan', default: null },
  membershipStartDate: { type: String, default: "" },
  membershipEndDate: { type: String, default: "" }
}, { timestamps: true });

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: "" },
  designation: { type: String, required: true }, // e.g., Senior Stylist, Beautician
  services: [{ type: String }], // Array of service names they offer
  image: { type: String, default: "" },
  bio: { type: String, default: "" },
  experience: { type: String, default: "" },
  status: { type: String, enum: ["Active", "Inactive", "On Leave"], default: "Active" },
  leaveStartDate: { type: String, default: "" },
  leaveEndDate: { type: String, default: "" }
}, { timestamps: true });

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [
    {
      serviceName: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 1 },
      amount: { type: Number, required: true },
      staffId: { type: String, default: '' },
      staffName: { type: String, default: '' },
      type: { type: String, default: 'service' }
    }
  ],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ["Cash", "Card", "UPI", "Split"], default: "Cash" },
  paymentBreakdown: [
    {
      method: { type: String, enum: ["Cash", "Card", "UPI"], required: true },
      amount: { type: Number, required: true }
    }
  ],
  status: { type: String, enum: ["Paid", "Unpaid", "Partially Paid", "Cancelled"], default: "Paid" },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const FeedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, default: '' },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  serviceName: { type: String, required: true },
  staffId: { type: String, default: '' },
  staffName: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' }
}, { timestamps: true });

const ProductReviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },     // product pid
  userId: { type: String, required: true },
  userName: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' }
}, { timestamps: true });

const InquirySchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    service: [String],
    message: { type: String, required: true },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
    recipientId: { type: String, required: true }, // 'admin' or userId
    senderId: { type: String },
    senderName: { type: String },
    type: { type: String, enum: ['order', 'appointment', 'inquiry', 'feedback', 'review', 'system'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('user', userSchema);
const Product = mongoose.model('tblproduct', ProductSchema);
const Order = mongoose.model('tblorder', OrderSchema);
const Cart = mongoose.model('tblcart', CartSchema);
const Category = mongoose.model('tblcategory', CategorySchema);
const Service = mongoose.model('tblservice', ServiceSchema);
const Package = mongoose.model('tblpackage', PackageSchema);
const Appointment = mongoose.model('tblappointment', AppointmentSchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const MembershipPlan = mongoose.model('MembershipPlan', MembershipPlanSchema);
const Staff = mongoose.model('Staff', StaffSchema);
const Invoice = mongoose.model('Invoice', InvoiceSchema);
const Feedback = mongoose.model('Feedback', FeedbackSchema);
const ProductReview = mongoose.model('ProductReview', ProductReviewSchema);
const Inquiry = mongoose.model('Inquiry', InquirySchema);
const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = { User, Product, Order, Cart, Category, Service, Package, Appointment, Customer, MembershipPlan, Staff, Invoice, Feedback, ProductReview, Inquiry, Notification };
