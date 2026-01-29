const serverless = require("serverless-http")
const express = require("express")
const cors = require("cors")
const multer = require("multer")

// Middleware
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Import routes
const adminRoutes = require("./routes/admin.routes")
const servicesRoutes = require("./routes/services.routes")
const videosRoutes = require("./routes/videos.routes")
const contactRoutes = require("./routes/contacts.routes")

// Multer memory storage
const upload = multer({ storage: multer.memoryStorage() })

// Routes
app.use("/api/admin", adminRoutes)
app.use("/api/services", servicesRoutes)
app.use("/api/videos", videosRoutes)
app.use("/api/contact", contactRoutes)

// Health check
app.get("/api", (req, res) => {
  res.json({ message: "Allure Marketing API is running!" })
})

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ error: "Something went wrong!" })
})

// IMPORTANT: Configure serverless-http with binary support
module.exports.handler = serverless(app, {
  binary: false,  // Disable binary mode for JSON parsing
  request: (request, event, context) => {
    // This ensures the body is properly decoded
    request.body = event.body
  }
})