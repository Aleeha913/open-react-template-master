import { Request, Response } from 'express';
import User from '../models/userModel';
//import { registerUser } from "../controllers/userController";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
