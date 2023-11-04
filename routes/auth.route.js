import express from "express";
import { sendOTP, verifyOTP } from "../controllers/auth.controller.js";

const route = express.Router();

route.post("/createUser", sendOTP);
route.post("/varifyUser", verifyOTP);
export default route;
