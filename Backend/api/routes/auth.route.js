import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();
// When a POST request comes to this path, run this function. path , contoller.
router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)

export default router;
