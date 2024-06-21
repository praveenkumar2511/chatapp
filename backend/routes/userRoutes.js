const express = require('express')
const {registerUser,login,allUsers} = require('../controller/userController')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.route("/").get(protect, allUsers);
router.route('/').post(registerUser)
router.post('/login',login)


module.exports= router