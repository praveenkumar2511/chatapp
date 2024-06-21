import React from "react";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [show, setShow] = useState(false);
  const [showConfirmPassword, setConfirmPasswordShow] = useState(false);
  const handleClick = () => setShow(!show);
  const handleClickConfirmPassword = () =>
    setConfirmPasswordShow(!showConfirmPassword);
  const toast = useToast();
  const navigate = useNavigate();
  // const [name, setName] = useState();
  // const [email, setEmail] = useState();
  // const [confirmpassword, setConfirmpassword] = useState();
  // const [password, setPassword] = useState();
  // const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    pic: "",
  });
  console.log(form,"form");
  const onChange = (e) => {
    console.log(e.target);
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePicture = (pic) => {
    setPicLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image.png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dt6pxtrpl");
      fetch("https://api.cloudinary.com/v1_1/dt6pxtrpl/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setForm((prevForm) => ({
            ...prevForm,
            pic: data.url.toString(),
          }));
          setPicLoading(false);
        })
        .catch((err) => {
          console.error("Error uploading image: ", err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setPicLoading(false);
      return;
    }
  };
  const submitHandler = async () => {
    setPicLoading(true);
    const { name, email, password, confirmpassword } = form;
    console.log(name, email, password, confirmpassword, "dgfhjk");
    if (!name || !email || !password || !confirmpassword) {
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
    if (password !== confirmpassword) {
      toast({
        title: "Passwords do not match",
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
      const { data } = await axios.post("/api/user", { form }, config);
      console.log(data, "data");

      toast({
        title: "Registration Successful",
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
  };
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter Your Name"
        name="name"
         value={form.name} 
        onChange={onChange} />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          name="email" 
          value={form.email} 
          onChange={onChange}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={onChange}
            name="password" value={form.password} 
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            onChange={onChange}
            name="confirmpassword" value={form.confirmpassword} 
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClickConfirmPassword}>
              {showConfirmPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => handlePicture(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
