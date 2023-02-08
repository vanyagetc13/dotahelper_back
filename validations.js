import {body} from "express-validator"

export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({min: 5}),
]

export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    body('fullName').isLength({min: 3}),
    body('avatarUrl').optional().isString(),
]

export const playerCreateValidation = [
    body('fullName').isLength({min: 3, max: 16}).isString(),
    body('steamId',).isLength(17).isString(),
    body('mmr').optional().isNumeric().isLength({min: 1, max: 5}),
]