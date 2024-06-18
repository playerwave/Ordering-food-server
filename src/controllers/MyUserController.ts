import { Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;

    //1. เช็คว่ามี user นี้ใน database หรือยัง
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      //ถ้ามีส่ง status 200 กลับไป
      return res.status(200).send();
    }

    //2. ถ้ายังไม่มีสร้างบัญชี user ใหม่
    const newUser = new User(req.body);
    await newUser.save(); // save user ลง database

    //3. return object user ไปยัง client ที่เรียกใช้
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.send(500).json({ message: "Error creating user." });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export default {
  getCurrentUser,
  createCurrentUser,
  updateCurrentUser,
};
