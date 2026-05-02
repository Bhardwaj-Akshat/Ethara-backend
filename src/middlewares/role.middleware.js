export const isAdmin = (req, res, next) => {
  // 🔥 FIX: check if user exists first
  if (!req.user) {
    return res.status(401).json({ msg: "User not authenticated" });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({ msg: "Access denied: Admin only" });
  }

  next();
};