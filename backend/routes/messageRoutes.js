const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { sendMesaage, allMesaage } = require('../controller/messageController')
const router = express.Router()


router.route('/').post(protect,sendMesaage)
router.route('/:chatId').get(protect,allMesaage)

module.exports=router