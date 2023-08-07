const {validationResult} = require('express-validator');
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try{
        const err = validationResult(req)
        if(!err.isEmpty()) {
            return res.status(400).json(err.errors)
        }
        const pass = req.body.password.toString();
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(pass, salt)
        const doc = new UserModel({
            email: req.body.email,
            password: hashPass,
            username: req.body.username,
            avatarUrl: req.body.avatarUrl
        })
        const user = await doc.save();

        const token = jwt.sign({
            username: user.username,
            _id: user._id
        },
        'secret', 
        {
            expiresIn: '30d'
        })

        const { password, ...userData} = user._doc
        return res.json({
            ...userData,
            token
        });
    } catch(err) {
        res.status(500).json({
            message: 'Не удалось зарегестрироваться'
        })
    }

}
const login = async (req, res) =>{
    try{
        const user = await UserModel.findOne({ email: req.body.email});
        if(!user) {
            return res.status(404).json({
                message: 'неверный логин или пароль'
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.password);
        if(!isValidPass) {
            return res.status(404).json({
                message: 'неверный логин или пароль'
            })
        }
        const token = jwt.sign({
            username: user.username,
            _id: user._id
        },
        'secret', 
        {
            expiresIn: '30d'
        })

        const { password, userData} = user._doc
        return res.json({
            ...userData,
            token
        });
    } catch(err) {
        res.status(500).json({
            message: 'Не удалось зарегестрироваться'
        })
    }
}

const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if(!user) {
            return res.status(404).json({
                message: 'Ползоваткль не найден'
            })
        }
        const { password, userData} = user._doc
        return res.json({
            userData
        });

    }catch {
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
}

module.exports = {register, login, getMe}