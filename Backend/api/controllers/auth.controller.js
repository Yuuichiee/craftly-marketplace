import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10);//many fields from body are coming but only hashing this pass here.
    const newUser = new User({
      ...req.body,//pass all the stuff that came with body to this.
      password: hash,
    });
    await newUser.save();
    res.status(201).send("User has been created.");
  } catch (err) {//MongoDB puts  information inside the err object when the duplicate error occurs.
    if (err.code === 11000) { // 11000 is a MongoDB duplicate-key error code.
      const field = Object.keys(err.keyPattern || {})[0] || "Username or email"; // Find the name of the duplicate field (username/email). If it can't find one, use "Username or email" as a fallback.
      return next(createError(409, `${field.charAt(0).toUpperCase() + field.slice(1)} already exists!`)); // next() is used to pass the error to Express's error-handling middleware.
    }
    next(err);
  }//Middleware is a function that executes between the request and response.
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong password or username!"));

    const jwtSecret = process.env.JWT_KEY || "liverrsecretkey98171_fallback_super_secure";

    const token = jwt.sign(
      { id: user._id, isSeller: user.isSeller },
      jwtSecret,
      { expiresIn: "7d" }
    );

    const { password, ...info } = user._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .send("User has been logged out.");
};
