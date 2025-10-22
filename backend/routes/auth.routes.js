import express from "express";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateJWTToken from "../utils/generateJWT.js";
import { authProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *               username:
 *                 type: string
 *                 example: johndoe
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin registered
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */

router.post("/register", async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (email && password && username) {
            const emailExists = await userModel.findOne({ email });
            if (emailExists) {
                return res.status(400).send("Email already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new userModel({ email, password: hashedPassword, username });
            await newUser.save();
            return res.status(201).send({ message: "Admin registered", token: generateJWTToken(newUser._id) });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
})

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User logged in
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).send("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).send("Invalid credentials");
    }
    res.send({ message: "User logged in", token: generateJWTToken(user._id) });
})

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/profile",authProtect ,async(req,res)=>{
    try {
        const user = req.user
        if (user) {
            res.status(200).send(user)
            console.log("user request succesfull")
        }
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
})
export default router