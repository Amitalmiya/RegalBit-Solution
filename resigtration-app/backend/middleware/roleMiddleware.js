const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "Amit@123$";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "Access denied, token missing." });

  const token = authHeader && authHeader.split(" ")[1];
  if(!token) {
    return res.status(401).json({message: "Access denied, token missing."})
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error : ", error.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'superadmin') next();
    else res.status(403).json({ message: "Admin access required"});
};

const isSuperAdmin = (req, res, next) => {
    if(req.user.role === 'superadmin') next();
    else res.status(403).json({message: "Super Admin access required"})
}


module.exports = {verifyToken, isAdmin, isSuperAdmin}