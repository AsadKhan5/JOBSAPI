const express = require('express')
const { register, login } = require('../controllers/auth')
const routers = express.Router();




routers.route('/register').post(register)
routers.post('/login', login)


module.exports = routers;

