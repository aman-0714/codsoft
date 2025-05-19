const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config(); // Use environment variables

// Create an Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // To handle JSON payloads
app.use(cors()); // To allow cross-origin requests

// Serve static files (ensure your HTML and assets are in the "public" folder)
app.use(express.static("public"));

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email from environment variables
    pass: process.env.EMAIL_PASS, // Your app password from environment variables
  },
});

// Route to handle form submissions
app.post("/send-message", (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("Please fill in all required fields.");
  }

  // Email configuration
  const mailOptions = {
    from: email,
    to: process.env.RECEIVER_EMAIL || "aman1404kaur@gmail.com", // Your email to receive messages
    subject: `New Message from Contact Form: ${subject || "No Subject"}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nMessage:\n${message}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Failed to send the message.");
    } else {
      console.log("Email sent:", info.response);
      return res.status(200).send("Message sent successfully.");
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
