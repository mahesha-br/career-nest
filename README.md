# 📌 Career-Nest

Career-Nest is a full-stack social media web application built using the **MERN stack** (MongoDB, Express.js, React, Node.js).  
It allows users to connect, share posts, interact through comments and likes, follow other users, and communicate via chat.

🌐 **Live Demo:** https://career-nest-alpha.vercel.app/  
📂 **GitHub Repository:** https://github.com/mahesha-br/career-nest  

---

## 📘 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshot](#screenshot)
- [Getting Started](#getting-started)
- [API Routes](#api-routes)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🚀 Features

- User authentication (Signup / Login)
- Create, like, and comment on posts
- Follow and unfollow users
- Notifications system
- Real-time messaging (chat)
- Secure authentication using JWT
- Responsive UI for all devices

---

## 💻 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication

### Deployment
- Vercel

---

## 📸 Screenshot

![](/frontend/public/career_nest.png)
---

## 🛠️ Getting Started

### 📌 Prerequisites

- Node.js (v14 or above)
- npm
- MongoDB Atlas account

---

### ⬇️ Clone the Repository

```bash
git clone https://github.com/mahesha-br/career-nest.git
cd career-nest

```

### 🔧 Install Dependencies

```
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### ⚙️ Environment Variables

Create a `.env` file in the `backend` folder:

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

### ▶️ Run the Application Locally

```
# Start backend server
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
```

Open your browser and navigate to:

```
http://localhost:5173
```

### 📡 API Routes

Base URL: `/api`

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| POST   | `/auth/signup`  | Register a new user |
| POST   | `/auth/login`   | Login user          |
| GET    | `/post`         | Get all posts       |
| POST   | `/post/create`  | Create a new post   |
| POST   | `/comment`      | Add a comment       |
| GET    | `/notification` | Get notifications   |
| POST   | `/conversation` | Create conversation |
| POST   | `/message/send` | Send message        |


### 📁 Project Structure

```
career-nest/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
├── frontend/
│   ├── src/
│   ├── dist/
│   └── vite.config.js
├── vercel.json
└── README.md
```

### 📝 License

This project is licensed under the MIT License.

📬 Contact

`Mahesha BR`

🔗 GitHub: https://github.com/mahesha-br

🌐 Portfolio: https://mahesha.dev

💼 LinkedIn: https://linkedin.com/in/mahesha-br


---

