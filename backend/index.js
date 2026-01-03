const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path=require('path');
const express = require('express');



require('dotenv').config(); // Loads variables from .env file

const app = express();
const PORT =process.env.PORT || 4000;


// MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('MongoDB Connected');
//   })
//   .catch(err => {
//     console.error('MongoDB connection error:', err);
//   });


// ... keep your imports (express, mongoose, etc.)

// 1. DATABASE CONNECTION LOGIC (REPLACE OLD CONNECT BLOCK)
let isConnected = false; 

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Don't exit process in Vercel; just throw error so the request fails cleanly
    throw err; 
  }
};

// 2. MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// 3. ENSURE DB IS CONNECTED BEFORE ROUTES
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// ... keep your app.use('/api/auth', UserRoutes) etc.



app.use(express.json())
app.use(cookieParser())
// app.use(cors({
//   credentials:true,
//   origin:"http://localhost:5173"
// }))

const allowedOrigins = [
  "http://localhost:5173",
  "https://career-nest-alpha.vercel.app",
  "http://localhost:4000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// app.use(
//   cors({
//     origin: true,
//     credentials: true
//   })
// );


const rootDir = path.resolve();

console.log("dir:",rootDir)


const UserRoutes = require('./routes/user');
const PostRoutes = require('./routes/post')
const NotificationRoutes=require('./routes/notification')
const CommentRoutes = require('./routes/comment')
const conversationRoutes = require('./routes/conversation')
const MessageRoutes=require('./routes/message')


// app.use(express.static(path.resolve(_dirname, 'frontend', 'dist')));

app.use(express.static(path.join(rootDir, "frontend", "dist")));


app.use('/api/auth',UserRoutes)
app.use('/api/post',PostRoutes)
app.use('/api/notification',NotificationRoutes)
app.use('/api/comment',CommentRoutes)
app.use('/api/conversation',conversationRoutes)
app.use('/api/message',MessageRoutes)


// app.get("/", (_, res) => {
//     res.sendFile(path.resolve(_dirname, 'frontend', 'dist', 'index.html'));
// });


app.get("*", (_, res) => {
  res.sendFile(
    path.join(rootDir, "frontend", "dist", "index.html")
  );
});

// Start server
// app.listen(PORT, () => {
//   console.log(`server listening on port ${PORT}`);
// });

module.exports = app;


if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}