import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userId = decodedToken.userId;

    next();
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};
