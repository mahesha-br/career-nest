const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path=require('path');
const express = require('express');



require('dotenv').config();

const app = express();
const PORT =process.env.PORT || 4000;


// MongoDB connection
global.dbError = null;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    global.dbError = null;
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    global.dbError = err.message || err.toString();
  });

mongoose.connection.on('error', err => {
  global.dbError = err.message || err.toString();
});




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
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy violation for origin: ${origin}`), false);
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


app.get("*", (req, res) => {
  const indexPath = path.join(rootDir, "frontend", "dist", "index.html");
  if (require('fs').existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.status(404).json({ error: "API Route Not Found" });
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