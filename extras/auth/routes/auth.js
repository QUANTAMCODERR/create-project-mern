const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;