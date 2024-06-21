const express =require('express')
const {protect} = require('../middleware/authMiddleware')
const {accessChat,fetchChat,createGroup,renameTheGroup,removeGroup,addToGroup} = require('../controller/chatController')
const router = express.Router()


router.route('/').post(protect,accessChat)
router.route('/').get(protect,fetchChat)
router.route('/group').post(protect,createGroup)
router.route('/rename').put(protect,renameTheGroup)
router.route('/groupadd').put(protect,addToGroup)
router.route('/groupRemove').put(protect,removeGroup)



module.exports= router