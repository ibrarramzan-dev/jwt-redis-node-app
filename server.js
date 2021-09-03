require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "THE API WORKED AND SENT YOU THIS JSON OBJECT",
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "ibrar" && password === "q12345678") {
    const access_token = jwt.sign(
      // ACCESS TOKEN Generation
      { sub: username, sub2: 10, sub3: "TYTYTYTYTYTYTYTYTYTYTY" },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TIME }
    );

    const refresh_token = jwt.sign(
      // REFRESH TOKEN Generation
      { sub: username, sub2: 10, sub3: "TYTYTYTYTYTYTYTYTYTYTY" },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_TIME }
    );

    return res.json({
      status: true,
      message: "LOGIN SUCCESSFUL!",
      data: {
        access_token,
        refresh_token,
      },
    });
  }

  return res
    .status(401)
    .json({ status: false, message: "LOGIN FAILED!!!!! >_<" });
});

app.get("/dashboard", verifyToken, (req, res) => {
  return res.json({ status: true, message: "Hello from Dashboard! :-)" });
});

// Custom Middleware
function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    console.log("DECODED: ", decoded);

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: true, message: "Your session is not valid!", data: err });
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started at PORT ${PORT}`));
