import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import {
    loginValidation,
    playerCreateValidation,
    registerValidation,
} from "./validations.js";

import checkAuth from "./utils/checkAuth.js";
import { PlayerController, UserController } from "./controllers/index.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import axios from "axios";

// Connection & App Creation
mongoose
    .connect(
        "mongodb+srv://admin:wwwwww@dota2helpercluster.gh1rtj0.mongodb.net/dotahelper?retryWrites=true&w=majority"
    )
    .then(() => {
        console.log("Connection is fine!");
    })
    .catch((err) => {
        console.log("DB is not connected", err);
    });
const app = express();
app.use(express.json());
app.use(cors());

// Default

app.get("/", (req, res) => {
    res.json("Hey!");
});

// Auth

app.post(
    "/auth/login",
    loginValidation,
    handleValidationErrors,
    UserController.login
);

app.get("/auth/me", checkAuth, UserController.findMe);

app.post(
    "/auth/register",
    registerValidation,
    handleValidationErrors,
    UserController.register
);

// Players

app.get("/players", checkAuth, PlayerController.getAll);

app.get("/players/:id", checkAuth, PlayerController.getById);

app.post(
    "/players",
    checkAuth,
    playerCreateValidation,
    handleValidationErrors,
    PlayerController.create
);

// Randomizer
app.post("/random", async (req, res) => {
    const amount = req.body.amount
    const response = await axios.post(
        "https://api.random.org/json-rpc/4/invoke",
        {
            jsonrpc: "2.0",
            method: "generateIntegerSequences",
            params: {
                apiKey: "6c7d0a35-2df0-46c7-80b0-67ab86a29af3",
                n: 1,
                length: [amount],
                min: [1],
                max: [amount],
                replacement: [false],
                base: [10],
            },
            id: 467333
        }
    );
    res.json(response.data);
});

// Listener

app.listen(4444, (err) => {
    if (err) console.log(err);
    else console.log("Server is OK!");
});
