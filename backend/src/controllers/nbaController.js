function healthCheck(req, res) {
  res.json({ message: "NBA route working" });
}

module.exports = {
  healthCheck,
};
