const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("No token");

  try {
    const decoded = jwt.verify(token, "secret123");
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};