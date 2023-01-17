import mongoose from "mongoose";

const PlayerScheme = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    mmr:Number,
    steamId: {
        required: true,
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

export default mongoose.model("Player", PlayerScheme);
