// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const { exec } = require('child_process');

// const app = express();
// const port = 3002;

// const cors = require('cors');
// app.use(cors());

// // Define storage for multer to handle file uploads
// const storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     },
// });

// const upload = multer({ storage: storage });

// // Endpoint to handle image uploads and predictions
// app.post('/api/predict', upload.single('image'), (req, res) => {
//     const filePath = path.join(__dirname, 'uploads', req.file.originalname);

//     exec(`python3 predict.py ${filePath}`, (error, stdout, stderr) => {
//         if (error) {
//             console.error(`Error executing Python script: ${stderr}`);
//             return res.status(500).json({ error: stderr });
//         }
//         console.log(`Python script output: ${stdout}`);
//         res.json({ prediction: stdout.trim() });
//     });

// });

// // Start server
// app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
// });

// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const cors = require("cors");
// const { exec } = require("child_process");

// const app = express();

// // Configure Multer with custom diskStorage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); // Save files to the "uploads" directory
//     },
//     filename: (req, file, cb) => {
//         const originalName = file.originalname.replace(/\s+/g, "_"); // Remove spaces in filename
//         cb(null, originalName); // Use the original filename
//     },
// });
// const upload = multer({ storage: storage });

// // Enable CORS to allow requests from your frontend
// app.use(
//     cors({
//         origin: "http://localhost:3001", // Update to your frontend's URL if necessary
//         methods: ["POST", "GET"],
//     })
// );

// app.post("/api/predict", upload.single("image"), (req, res) => {
//     console.log("Request received for prediction");
//     console.log("Uploaded file details:", req.file);

//     if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//     }

//     // Normalize the image path
//     const imagePath = path.join(__dirname, req.file.path).replace(/\\/g, "/");
//     console.log("Normalized image path:", imagePath);

//     // Execute the Python script with the image path
//     exec(`python predict.py "${imagePath}"`, (error, stdout, stderr) => {
//         if (error) {
//             console.error("Error executing Python script:", error);
//             return res.status(500).json({ error: "Prediction failed. Check server logs for details." });
//         }

//         if (stderr) {
//             console.error("Python script error output:", stderr);
//             return res.status(500).json({ error: "Prediction failed. Check server logs for details." });
//         }

//         const prediction = stdout.trim(); // Clean and trim Python script output
//         console.log("Prediction result:", prediction);
//         res.json({ prediction });
//     });
// });

// // Start the server
// app.listen(3002, () => {
//     console.log("Server running on http://localhost:3002");
// });

const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure Multer with custom diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to the "uploads" directory
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname.replace(/\s+/g, "_"); // Remove spaces in filename
    cb(null, originalName); // Use the original filename
  },
});
const upload = multer({ storage: storage });

// Enable CORS to allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:3001", // Update to your frontend's URL if necessary
    methods: ["POST", "GET"],
  })
);

app.post("/api/predict", upload.single("image"), (req, res) => {
  console.log("Request received for prediction");
  console.log("Uploaded file details:", req.file);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Normalize the image path
  const imagePath = path.join(__dirname, req.file.path).replace(/\\/g, "/");
  console.log("Normalized image path:", imagePath);

  // Check if the file exists
  if (!fs.existsSync(imagePath)) {
    console.error("File not found at:", imagePath);
    return res.status(500).json({ error: "Uploaded file not found." });
  }

  console.log("Calling predict.py...");

  // Execute the Python script with the image path
  exec(`python predict.py "${imagePath}"`, (error, stdout, stderr) => {
    console.log("i am ");
    // if (error) {
    //     console.error("Error executing Python script:", error.message);
    //     return res.status(500).json({ error: "Prediction failed. Check server logs for details." });
    // }

    if (stderr) {
      console.error("Python script stderr:", stderr);
    }
    console.log("reached here ");
    console.log("Raw Python script output:", stdout);
    // Locate the .json file (assumes predict.py saves it as <image_path>.json)
    const jsonFilePath = `${imagePath}.json`;
    console.log("Expected JSON file path:", jsonFilePath);

    // Check if the JSON file exists
    if (!fs.existsSync(jsonFilePath)) {
      console.error("JSON file not found at:", jsonFilePath);
      return res.status(500).json({ error: "Prediction result not found." });
    }

    // Read the JSON file
    fs.readFile(jsonFilePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading JSON file:", err.message);
        return res
          .status(500)
          .json({ error: "Failed to read prediction result." });
      }

      try {
        // Parse the JSON file's content
        const result = JSON.parse(data);
        console.log("Prediction result from file:", result);

        // Send the result to the client
        res.status(200).json(result);
      } catch (parseError) {
        console.error("Error parsing JSON file content:", parseError.message);
        res.status(500).json({ error: "Corrupted prediction result in file." });
      }
    });
  });
});

// Start the server
app.listen(3002, () => {
  console.log("Server running on http://localhost:3002");
});

// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const cors = require("cors");
// const { exec } = require("child_process");
// const fs = require("fs");

// const app = express();

// // Configure Multer with custom diskStorage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); // Save files to the "uploads" directory
//     },
//     filename: (req, file, cb) => {
//         const originalName = file.originalname.replace(/\s+/g, "_"); // Remove spaces in filename
//         cb(null, originalName); // Use the original filename
//     },
// });
// const upload = multer({ storage: storage });

// // Enable CORS to allow requests from your frontend
// app.use(
//     cors({
//         origin: "http://localhost:3001", // Update to your frontend's URL if necessary
//         methods: ["POST", "GET"],
//     })
// );

// app.post("/api/predict", upload.single("image"), (req, res) => {
//     console.log("Request received for prediction");
//     console.log("Uploaded file details:", req.file);

//     if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//     }

//     // Normalize the image path
//     const imagePath = path.join(__dirname, req.file.path).replace(/\\/g, "/");
//     console.log("Normalized image path:", imagePath);

//     // Check if the file exists
//     if (!fs.existsSync(imagePath)) {
//         console.error("File not found at:", imagePath);
//         return res.status(500).json({ error: "Uploaded file not found." });
//     }

//     // Execute the Python script with the image path
//     exec(`python predict.py "${imagePath}"`, (error, stdout, stderr) => {
//         if (error) {
//             console.error("Error executing Python script:", error);
//             return res.status(500).json({ error: "Prediction failed. Check server logs for details." });
//         }

//         const jsonFilePath = imagePath + ".json"; // Prediction result JSON file
//         if (fs.existsSync(jsonFilePath)) {
//             // Read and send the JSON result to the client
//             const jsonData = fs.readFileSync(jsonFilePath, "utf8");
//             res.json(JSON.parse(jsonData));
//         } else {
//             res.status(500).json({ error: "Prediction JSON file not found." });
//         }
//     });
// });

// // Start the server
// app.listen(3002, () => {
//     console.log("Server running on http://localhost:3002");
// });
