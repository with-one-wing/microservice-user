const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {

    try {
        const existUser = await User.findOne({email: req.body.email});
        const hash = await bcrypt.hash(req.body.password, 10);
        if (existUser) {
            req.status = 409;
            throw new Error('User exists');
        }
        if (!hash) {
            req.status = 500;
            throw new Error('Hash problem');
        }
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
        });
        user.save();
        res.status(201).json({
            res: user
        });
    } catch(err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const result = await User.find({email: req.body.email});

        if (result.length < 1) {
            req.status = 401;
            throw new Error('Not found USER', 401);
        }
        bcrypt.compare(req.body.password, result[0].password, (err, isMatch)=>{
            if (err) {
                req.status = 401;
                throw err;
            }
            if (!isMatch) {
                next(Error('Password mismatch' + result[0].password));
            } else {
                const token = jwt.sign(
                    {
                        email: result[0].email,
                        userId: result[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                res.status(202).json({
                    message: 'User Successfully authorized',
                    token,
                    request: {
                        type: 'GET',
                        description: 'Get all users',
                        url: 'http://localhost:3000/users/'
                    }
                });
            }
        });


    } catch (e) {
        next(e);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const result = await User.remove({_id: req.params.id});
        if (result.n === 0) {
            req.status = 404;
            throw new Error('Not found to delete');
        }
        res.status(202).json({
            message: 'User Successfully deleted',
            result: result,
            request: {
                type: 'GET',
                description: 'Get all users',
                url: 'http://localhost:3000/users/'
            }
        });
    } catch (e) {
        next(e);
    }
};
