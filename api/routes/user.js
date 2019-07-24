const express = require('express');
const router = express.Router();
const deleteUser = require("../controllers/users").deleteUser;
const login = require("../controllers/users").login;
const signup = require("../controllers/users").signup;
const {checkAuth} = require('auth_vvv');

router.route('/signup').post(signup);
router.route('/:id').delete(checkAuth, deleteUser);
router.route('/login').post(login);

module.exports = router;