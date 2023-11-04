import twilio from "twilio";
import generateOTP from "../utils/genarateOTP.js";
import { throwError } from "../utils/error.js";
import User from "../models/users.models.js";
import jwt from "jsonwebtoken";

//====Twilio Account Informations======//

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: false,
});

let OTP = generateOTP(6);
let Userphone;
let userName;
export const sendOTP = async (req, res, next) => {
  const { name, phone } = req.body;
  userName = name;
  Userphone = phone;

  try {
    const message = await client.messages.create({
      body: `Your OTP code is: ${OTP}.`,
      to: `${phone}`,
      from: "+16414183061",
    });
    console.log(message);
    res
      .cookie("userInfo", req.body)
      .status(200)
      .json("OTP send to successfully");
    setTimeout(() => {
      OTP = null;
    }, 120000);
  } catch (error) {
    next(error);
    console.error(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  if (OTP === null) return throwError(400, "OTP expired");
  if (OTP !== req.body.otp) return throwError(400, " Invalid OTP");
  console.log("otp matched");
  try {
    const isExistUser = await User.findOne({ phone: Userphone });

    //====IF USER IS ALREADY EXIST====//
    if (isExistUser) {
      const tooken = jwt.sign({ id: isExistUser._id }, process.env.JWT_SECRET);
      res
        .cookie("access_tooken", tooken, { httpOnly: true, secure: true })
        .status(200)
        .json(isExistUser);
    }

    //====IF USER IS NOT EXIST====//
    else {
      const newUser = new User({
        name: userName,
        phone: Userphone,
      });

      const user = await newUser.save();
      const tooken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res
        .cookie("access_tooken", tooken, { httpOnly: true, secure: true })
        .status(200)
        .json(user);
    }
  } catch (error) {
    next(error);
  }
};
