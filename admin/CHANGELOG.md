# Preety Salon Admin — Changelog

All notable changes to this project will be documented in this file.

---

## [2026-03-04 22:27] — Added Product Page & Cleaned Sidebar

### Added

- **`src/pages/Product.jsx`** [NEW] — Created Product Details page converted from `product-details.html`. Features product image gallery, variant pickers (color/size), quantity control, buy buttons, SKU info, trust seal, and tabbed content.
- **`src/components/Layout.jsx`** [NEW] — Created shared layout wrapper component using React Router `Outlet` for consistent sidebar + content + footer structure across all pages.

### Changed

- **`src/App.jsx`** — Restructured routing to use nested layout pattern with `Layout` wrapping `Dashboard` (`/`) and `Product` (`/product`) routes.
- **`src/pages/Dashboard.jsx`** — Simplified to content-only (removed wrapper/sidebar/footer since `Layout` handles that).
- **`src/components/Sidebar.jsx`** — Added "Product Details" link (`/product`) under Product menu. Removed Report menu item, Support section, and Connect Us section.

---

## [2026-03-04 22:25] — Removed Navbar & Renamed Site

### Changed

- **`src/pages/Dashboard.jsx`** — Removed `Navbar` component import and usage from the dashboard layout.
- **`src/components/Sidebar.jsx`** — Replaced Dataflow logo image with "Preety Salon" text branding.
- **`src/components/Footer.jsx`** — Updated copyright text from "Dataflow" to "Preety Salon".

---

---

## [2026-03-04] — Reverted to Original Dataflow Theme

### Changed

- **`src/components/Sidebar.jsx`** — Restored original Dataflow template sidebar with full logo, text-labeled menu items (Ecommerce, Product, Category, Attributes, Order, Users, Report, Setting, Log out), Support section (Terms & Conditions, FAQs, Privacy Policy), and social links. Replaced the narrow 72px icon-only sidebar with inline styles.
- **`src/pages/Dashboard.jsx`** — Restored original template layout structure (`layout-wrap` → `section-content-right` → `main-content`). Re-added `Navbar` import. Replaced custom salon-themed inline-styled cards (Sales, Visits, Appointments, Invoices, Staff) with original 4 stat cards (Total Earnings, Total Orders, Customers, My Balance) and Revenue chart section.

### Unchanged

- **`src/components/Navbar.jsx`** — Already matched the original Dataflow template; no changes needed.
- **`src/components/Footer.jsx`** — Already matched the original template; no changes needed.

---

## [2026-03-04] — Matching Dashboard Theme (Reverted)

> This change was reverted in the entry above.

### Changed

- Redesigned sidebar to a narrow 72px icon-only sidebar with inline styles.
- Removed Navbar from Dashboard, added inline-styled header bar.
- Replaced dashboard content with custom salon-themed cards (Sales, Visits, Appointments, Invoices, Staff).

---

## [2026-03-03] — Fixing Product Links

### Changed

- Fixed product links to correctly redirect to respective product detail pages.
- Dynamic rendering of product info based on product ID.

---

## [2026-03-02] — Initial Setup

### Added

- Project scaffolded with Vite + React.
- Created `Navbar.jsx`, `Sidebar.jsx`, `Footer.jsx` components from the Dataflow template.
- Created `Dashboard.jsx` page integrating all components.
- Created `Login.jsx` and `Register.jsx` auth pages.
- Set up React Router with protected routes.
- Added Dataflow template CSS, fonts, icons, and JS assets.
