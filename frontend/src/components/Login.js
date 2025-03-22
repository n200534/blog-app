import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../store';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [inputs, setInputs] = useState({
    name: "", email: "", password: ""
  });

  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Error state

  // Handle input change
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  // Send API request
  const sendRequest = async (type = "login") => {
    try {
      const res = await axios.post(`http://localhost:5000/api/user/${type}`, {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password
      });

      console.log("API Response:", res.data); // Debugging
      return res.data;
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setErrorMessage(err.response?.data?.message || "Something went wrong!");
      return null; // Return null if request fails
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset previous errors
  
    console.log("Submitting form with:", inputs);
  
    const data = await sendRequest(isSignup ? "signup" : "login");
  
    if (!data || !data.user || !data.user._id || !data.token) {
      console.error("Error: Invalid response from server", data);
      setErrorMessage("Invalid response from server. Please try again.");
      return;
    }
  
    console.log("Login successful! Storing userId and token:", data.user._id, data.token);
    localStorage.setItem("userId", data.user._id);
    localStorage.setItem("token", data.token); // Store the token
  
    dispatch(authActions.login());
    console.log("Redux login action triggered.");
  
    navigate("/blogs");
    console.log("Navigating to /blogs...");
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          boxShadow="10px 10px 20px #ccc"
          padding={3}
          margin="auto"
          marginTop={5}
          borderRadius={5}
          maxWidth={400}
        >
          <Typography variant="h2" padding={3} textAlign="center">
            {isSignup ? "Signup" : "Login"}
          </Typography>
          
          {errorMessage && ( // Show error if exists
            <Typography color="error" textAlign="center">
              {errorMessage}
            </Typography>
          )}

          {isSignup && <TextField name="name" onChange={handleChange} value={inputs.name} placeholder="Name" margin="normal" />}
          <TextField name="email" type="email" onChange={handleChange} value={inputs.email} placeholder="Email" margin="normal" />
          <TextField name="password" type="password" onChange={handleChange} value={inputs.password} placeholder="Password" margin="normal" />

          <Button type="submit" variant="contained" color="warning" sx={{ borderRadius: 3, marginTop: 3 }}>
            Submit
          </Button>
          <Button onClick={() => setIsSignup(!isSignup)} sx={{ borderRadius: 3, marginTop: 3 }}>
            Change to {isSignup ? "Login" : "Signup"}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Login;