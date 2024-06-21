import { FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import React from "react";
import { Button } from "@chakra-ui/button";
import { InputGroup, InputRightElement } from "@chakra-ui/input";
import { useState } from "react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  // const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate()
  const [picLoading, setPicLoading] = useState(false);

const[form,setForm]=useState({
   name:"",
   email:"",
   password:""
})

const handleonChange=(e)=>{
  const{name,value}= e.target
  setForm((prveVal)=>({
    ...prveVal,
    [name]:value
  }))

}
const submitHandler =async()=>{
  setPicLoading(true);
  const { name, email, password } = form;
  console.log(name, email, password, "dgfhjk");
  if (!name || !email || !password ) {
    toast({
      title: "Please Fill all Fields",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
    setPicLoading(false);
    return;
  }
 
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post("/api/user/login", { form }, config);
    console.log(data, "data");

    toast({
      title: "Login Successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setPicLoading(false);
    navigate("/chat");
  } catch (error) {
    toast({
      title: "error",
      description: error.response.data.message,
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
    setPicLoading(false);
  }
}

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={handleonChange}
          name="name"
          value={form.name}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={handleonChange}
          name="email"
          value={form.email}        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={handleonChange}
            name="password"
            value={form.password}          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
