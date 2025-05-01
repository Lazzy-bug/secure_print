const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

const shopRoutes = require('./routes/shopRoutes');

const documentRoutes = require('./routes/documentRoutes');


// Initialize Express and Socket.IO
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust to your frontend origin
    methods: ["GET", "POST"],
  },
});

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies and credentials
  })
);
app.use(express.json());
app.use(cookieParser());

// Middleware for session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // Helps prevent XSS attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    },
  })
);

// Passport Google OAuth setup
const GoogleStrategy = require("passport-google-oauth20").Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile._json.email });
        if (!user) {
          user = new User({
            email: profile._json.email,
            name: profile.displayName,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    // No need to specify `useNewUrlParser` or `useUnifiedTopology`
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
// Use routes
app.use("/api", authRoutes); 
app.use("/api/auth", userRoutes);
app.use("/api/user", userRoutes);
app.use("/api/owner", ownerRoutes);
// app.use("/api/chat", messageRoutes);
// app.use("/api/files", fileRoutes);
// app.use('/api/shops', shopRoutes);

app.use("/api/chat", documentRoutes); // File upload routes
app.use("/api/shops", shopRoutes);
// Socket.IO for real-time communication
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinChat", ({ userId, shopId }) => {
    socket.join(shopId); // Join chat room based on shopId
  });

  socket.on("sendMessage", (message) => {
    io.to(message.shopId).emit("receiveMessage", message); // Emit message to all users in the shop room
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
console.log('POST /upload route hit');

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
