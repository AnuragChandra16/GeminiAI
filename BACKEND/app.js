require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

//!Express instance
const app = express();
//!Middlewares
// const corsOptions = {
//   origin: ["http://localhost:5174", "http://localhost:5173"],
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// };
// app.use(cors(corsOptions));
const corsOptions = {
  origin: ['https://gemini-ai-frontend-five.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

//!Generate content route
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.send(text);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to generate content");
  }
});

//!Start the server
const PORT=process.env.PORT || 8080;

app.listen(PORT,console.log(`Server is running on ${PORT}`))
// const port=process.env.port
// app.listen(8080, console.log("Server is running"));