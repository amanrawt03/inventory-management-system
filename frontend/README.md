🏭 Inventory & Sales Management System (Full-Stack Project)
Stack: React.js, Node.js, PostgreSQL, Tailwind CSS, Cloudinary, Redis, SSE, JWT, Nodemailer

A real-time, secure, full-featured inventory & transaction management system built from scratch to streamline stock tracking, purchases, and sales across multiple factory locations.

🔐 Authentication & Security Flow
Implemented SSO login with Google OAuth for quick access and improved onboarding.

Used JWT-based authentication, storing tokens securely in the database (not cookies) to avoid XSS/CSRF vulnerabilities.

Developed auto-expiry & cleanup logic for tokens and sessions to improve security and scalability.

Integrated Nodemailer to handle secure password resets and forgot-password flows with email-based OTP verification.

👤 User Profile Management
Integrated Cloudinary with multiparty parser to allow users/admins to upload and update profile pictures securely and efficiently.

Built a smooth UI/UX to manage user profiles from the admin dashboard.

📦 Real-Time Inventory Management
Used Server-Sent Events (SSE) to ensure all users connected to the system see live updates:

When stock is updated (e.g., a sale is made or purchase recorded), all active users are instantly notified.

Prevents stale data usage or conflicting transactions in multi-user environments.

📊 Interactive Admin Dashboard
Built a fully interactive dashboard displaying:

Revenue, Profit/Loss, Live Sales Graphs

Inventory levels per location, supplier, product, and category

Optimized data fetching for large datasets using pagination, filtering, and server-side logic.

🛒 Sales Flow (End-to-End Transaction System)
Step-by-step interface for handling sales:

Select or create a customer

Choose products to sell → enter selling price, cost price, discount

Stock check across all locations → validate availability

Transaction entry + Invoice generation

Generates PDF invoice with embedded QR code, which when scanned opens the transaction on mobile

🛍️ Purchase Flow (Procurement Workflow)
Designed a guided interface for handling inventory purchases:

Select/add supplier

Choose category → list or add products

Select target location

Create and confirm purchase transaction

Allowed full edit/review access for past transactions — transactional history is traceable and reversible

🔁 Automation & Alerts
Set up cron jobs using Node and Nodemailer:

Scheduled daily/weekly low-stock reports

If any product stock fell below a pre-defined threshold → auto-email sent to all admins

🧾 Invoice System
Auto-generated detailed invoices after every sale/purchase

Embedded QR codes on invoices that could be scanned to:

Quickly access transaction details

Improve traceability and reduce paper dependency

🔔 Notification System + Caching (Redis Pub/Sub + Smart Cache)
Built a real-time notification system using Redis pub/sub architecture:

Instant alerts for: new transactions, low stock, new entries (customer, supplier, product)

User-wise Read/Unread tracking, improving operational clarity

Leveraged Redis caching to store high-read/low-write data (like categories, location lists, producst lists), reducing DB calls and improving API performance

Auto-updated cache on data change to prevent stale values



🧠 Highlights
Modular, scalable, and built to mimic real-world B2B sales + inventory ops

Designed to support multiple users, live state, accurate syncing, and high visibility

Built from scratch with no boilerplate — focused on performance, security, and usability
