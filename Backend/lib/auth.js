import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Lấy token từ header

  if (!token) {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token hết hạn hoặc không hợp lệ" });
    }
    req.user = user;
    next();
  });
};
// export const token = (req, res) => {
//   const user = req.user;
//   const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
// }
export default authenticateToken;
