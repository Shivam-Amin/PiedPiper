import bcrypt from'bcrypt';
import { sendCookie } from "../utils/features.js";
import { ErrorHandler } from "../middleware/err.js";

import db from '../models/index.js';
import { generateUUID } from '../utils/idGenrator.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check for a user exists with same email
    let user = await db.user.findOne({ where: { email: email } });
    // if no user, means user can't login but can register.
    if (!user) {
      return next(new ErrorHandler("Invalid email or password!", 404));
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password!", 404));
    }
    sendCookie(user, res, `Welcome back, ${user.username}`, 200);
  } catch (error) {
    next(error);
  }
}

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {expires: 
      new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "Production" ? true : false,
    })
    .json({
      success: true,
      message: "Logout Successfully!",
  })
}

export const myProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  })
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
  
    // check for a user exists with same email
    let user = await db.user.findOne({ where: { email: email } });

  
    if (user) {
      return next(new ErrorHandler("User already exist...", 404));
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);

    const uuid = await generateUUID(db.user);

    // ADD NEW USER TO DB
    user = await db.user.create({ _id: uuid, username: name, email: email, password: hashedPassword });
  
    sendCookie(user, res, "Registered Successfully!", 201);
  } catch (error) {
    next(error);
  }
}
