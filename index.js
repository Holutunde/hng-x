const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Define the endpoint
app.get("/api", (req, res) => {
  const { slack_name, track } = req.query;
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });
  const utc_time = new Date().toISOString();

  const response = {
    slack_name,
    current_day: currentDay,
    utc_time,
    track,
    github_file_url: "https://github.com/Holutunde/hng-x.git/index.js",
    github_repo_url: "https://github.com/Holutunde/hng-x.git",
    status_code: 200,
  };

  res.json(response);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
