import jwt from "jsonwebtoken"; // JWT is basically a proof that the user has successfully logged in.
import createError from "../utils/createError.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return next(createError(401, "You are not authenticated!")); // JavaScript treats a non-empty string as true

  const jwtSecret = process.env.JWT_KEY || "liverrsecretkey98171_fallback_super_secure";

  jwt.verify(token, jwtSecret, async (err, payload) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
    next();
  });
};
