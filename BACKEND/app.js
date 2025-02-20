// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// //!Express instance
// const app = express();
// //!Middlewares
// // const corsOptions = {
// //   origin: ["http://localhost:5174", "http://localhost:5173"],
// //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// // };
// // app.use(cors(corsOptions));
// const corsOptions = {
//   origin: ['http://localhost:8000'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 204
// };

// app.use(cors(corsOptions));

// // Handle preflight requests
// app.options('*', cors(corsOptions));

// app.use(express.json());
// // Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// //!Generate content route
// app.post("/generate", async (req, res) => {
//   const { prompt } = req.body;
//   try {
//     // For text-only input, use the gemini-pro model
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     res.send(text);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Failed to generate content");
//   }
// });

// //!Start the server
// const PORT=process.env.PORT || 8080;

// app.listen(PORT,console.log(`Server is running on ${PORT}`))
// // const port=process.env.port
// // app.listen(8080, console.log("Server is running"));



require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Express instance
const app = express();

// Check if API key exists
if (!process.env.API_KEY) {
    console.error("API_KEY not found in environment variables");
    process.exit(1);
}

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:8000',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};

// Apply middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.json({ 
        message: "Server is running",
        endpoints: {
            root: "GET /",
            generate: "POST /generate"
        }
    });
});

// Generate content route
app.post("/generate", async (req, res) => {
    const { prompt } = req.body;
    
    if (!prompt) {
        return res.status(400).json({
            error: "Missing prompt",
            message: "Please provide a prompt in the request body"
        });
    }

    try {
        // Make sure to use the correct model name
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ 
            success: true,
            result: text 
        });
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({
            error: "Failed to generate content",
            message: error.message
        });
    }
});

// Handle 404s
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: "The requested URL was not found on this server.",
        path: req.path
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Something broke!",
        message: err.message
    });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test the server at http://localhost:${PORT}`);
});