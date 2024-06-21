import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import {
  Box,
} from '@chakra-ui/layout'
import SideDrawer from '../component/misellenous/SideDrawer'
import MyChats from '../component/MyChats'
import ChatBox from '../component/ChatBox'
const Chat = () => {
 const {user} = ChatState()
const[fetchAgain,setFetchAgain]=useState(false)
  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" backgroundColor=""  w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain}  />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />} 
      </Box>
    </div>
  )
}

export default Chat
