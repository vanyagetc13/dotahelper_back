import PlayerModel from "../models/Player.js";

export const create = async (req, res) => {
    try {
        const doc = new PlayerModel({
            fullName: req.body.fullName,
            user: req.userId,
            mmr: req.body.mmr,
            steamId: req.body.steamId,
        });
        const player = await doc.save();
        res.json(player);
    } catch (err) {
        console.log(err);
        res.status(500).json("Ошибка создания пользователя");
    }
};

export const getAll = async (req, res) => {
    try {
        const array = await PlayerModel.find({ user: req.userId }).exec();
        res.json(array);
    } catch (err) {
        console.log(err);
        res.status(500).json("Ошибка");
    }
};

export const getById = async (req, res) => {
    try {
        const player = await PlayerModel.findById(req.params.id);
        if (!player)
            return res.status(404).json({ message: "Игрок не найден." });

        res.json(player)
    } catch (err) {}
};
