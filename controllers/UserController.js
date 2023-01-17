import UserModel from "../models/User.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: "Не верный логин или пароль.",
            });
        }
        const isValidPass = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );
        if (!isValidPass) {
            return res.status(404).json({
                message: "Не верный логин или пароль.",
            });
        }
        const token = jwt.sign(
            {
                _id: user._id,
            },
            "dotahelperSecretKey",
            {
                expiresIn: "7d",
            }
        );
        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось авторизоваться.",
        });
    }
}

export const register = async (req, res) => {
    try {
        const pass = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "dotahelperSecretKey",
            {
                expiresIn: "7d",
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось зарегестрироваться.",
        });
    }
}

export const findMe = async (req, res) => {
    const user = await UserModel.findById(req.userId);
    if (!user)
        return res.status(404).json({
            message: "Пользователь не найден.",
        });
    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
}