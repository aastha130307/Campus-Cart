# 🛒 CampusCart – Spend Less, Share More

CampusCart is a full-stack student marketplace platform built for hostel and campus communities where students can **buy, sell, borrow, and request items** within their college network.

The platform promotes affordability, sustainability, and resource sharing among students by creating a centralized campus marketplace experience.

---

# ✨ Features

## 🔐 Authentication System

* Email & Password Login using Firebase Authentication
* Google Sign-In Integration
* Email Verification System
* Password Reset Functionality
* Secure Protected Routes

---

## 👤 User Profile Management

* Create and update student profiles
* Store branch, year, hostel, contact, and UPI details
* View profiles of buyers and sellers
* Automatic profile-based redirection

---

## 🛍️ Marketplace System

* Upload items for sale
* Browse available products
* Dynamic search functionality
* View seller profiles directly from listings

---

## 📦 Request & Borrowing System

* Request items for buying or borrowing
* Add urgency level and purpose
* “I Have It” response system
* View responder profiles and contact details

---

## 🎨 Responsive UI

* Modern card-based interface
* Sidebar navigation
* Search bars with icons
* Mobile-friendly responsive design
* Interactive UI using Font Awesome

---

# 🛠️ Tech Stack

## 💻 Frontend

* HTML5
* CSS3
* JavaScript (ES6 Modules)

## ☁️ Backend & Database

* Firebase Authentication
* Cloud Firestore
* Firebase Storage (planned integration)

## ⚙️ Tools & Libraries

* Font Awesome Icons
* Firebase SDK

---

# 🗂️ Firebase Collections

## 👥 users

Stores:

* Name
* Branch
* Year
* Hostel
* Contact Number
* UPI ID

---

## 📚 items

Stores:

* Item Name
* Price
* Description
* Seller ID

---

## 📩 requests

Stores:

* Requested Item
* Purpose
* Description
* Urgency Level

---

## 🤝 responses

Stores:

* Responder Details
* Contact Information
* Request ID
* Timestamp

---

# 🚀 Project Workflow

## 📝 User Registration

1. User signs up using Email/Password or Google
2. Email verification is required
3. User completes profile setup
4. User gains access to the platform

---

## 💰 Selling an Item

1. User uploads item details
2. Item becomes visible in Browse section
3. Other students can contact seller

---

## 📥 Requesting an Item

1. User creates a request
2. Other students respond using “I Have It”
3. Request owner receives responder details

---

# 🧠 Concepts Implemented

* Firebase Authentication
* Firestore CRUD Operations
* Modular JavaScript
* Dynamic DOM Manipulation
* Protected Routing
* Responsive Web Design
* Real-world Marketplace Workflow

---

# 📂 Folder Structure

```bash
CampusCart/
│
├── auth.html
├── browse.html
├── end.html
├── profile.html
├── profile-setup.html
│
├── auth.js
├── browse.js
├── profile.js
├── firebase.js
├── end.js
│
├── browse.css
├── end.css
│
└── README.md
```

---

# 🔧 Setup Instructions

## 1️⃣ Clone the Repository

```bash
git clone <repository-link>
```

---

## 2️⃣ Open Project Folder

```bash
cd CampusCart
```

---

## 3️⃣ Configure Firebase

Replace the Firebase configuration inside:

```js
firebase.js
```

with your own Firebase project credentials.

---

## 4️⃣ Run the Project

Use:

* VS Code Live Server
* Any local development server

---

# 🌟 Future Improvements

* 📸 Item Image Uploads
* 💬 Real-Time Chat System
* ✅ Mark Item as Sold
* ❤️ Wishlist Feature
* ⭐ Ratings & Reviews
* 🔔 Push Notifications
* 🌙 Dark Mode
* 🛡️ Admin Dashboard

---

# 📖 Learning Outcomes

This project helped in understanding:

* Full-stack Web Development
* Firebase Authentication
* Firestore Database Management
* Modular JavaScript Architecture
* Responsive UI Design
* Real-world CRUD Applications

---

# 👩‍💻 Author

**Aastha Pandey**
I developed this project as my first college project in the second semester of my college NIT Delhi.
---
