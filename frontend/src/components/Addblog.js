import { Box, Button, InputLabel, TextField, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const labelStyles = { mb: 1, mt: 2, fontSize: "20px", fontWeight: "bold" };

const AddBlog = () => {
  const [inputs, setInputs] = useState({ title: "", description: "", imageUrl: "" });
  const [success, setSuccess] = useState(false); // Success notification state
  const [error, setError] = useState(false); // Error notification state

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError(true);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/blog/add", {
        title: inputs.title,
        description: inputs.description,
        image: inputs.imageUrl,
        user: localStorage.getItem("userId"),
      }, {
        headers: { Authorization: `Bearer ${token}` }, // Include token in headers
      });
      setSuccess(true); // Show success notification
      return res.data;
    } catch (err) {
      setError(true); // Show error notification
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          borderColor="linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(121,9,117,1) 35%, rgba(0,212,255,1) 100%)"
          border={3}
          borderRadius={8}
          boxShadow="5px 5px 15px #ccc"
          padding={3}
          margin="auto"
          marginTop={3}
          display="flex"
          flexDirection="column"
          width="50%"
        >
          <Typography fontWeight="bold" padding={2} color="gray" variant="h4" textAlign="center">
            POST YOUR BLOG
          </Typography>
          <InputLabel sx={labelStyles}>Title</InputLabel>
          <TextField name="title" onChange={handleChange} value={inputs.title} margin="normal" variant="outlined" />
          <InputLabel sx={labelStyles}>Description</InputLabel>
          <TextField name="description" onChange={handleChange} value={inputs.description} margin="normal" variant="outlined" multiline rows={4} />
          <InputLabel sx={labelStyles}>Image URL</InputLabel>
          <TextField name="imageUrl" onChange={handleChange} value={inputs.imageUrl} margin="normal" variant="outlined" />
          {inputs.imageUrl && (
            <img src={inputs.imageUrl} alt="Blog Preview" style={{ width: "100%", height: "auto", marginTop: "10px", borderRadius: "8px" }} />
          )}
          <Button sx={{ mt: 2, borderRadius: 4 }} variant="contained" color="warning" type="submit">
            Submit
          </Button>
        </Box>
      </form>

      {/* Snackbar for Success */}
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Blog added successfully!
        </Alert>
      </Snackbar>

      {/* Snackbar for Error */}
      <Snackbar open={error} autoHideDuration={3000} onClose={() => setError(false)}>
        <Alert onClose={() => setError(false)} severity="error" sx={{ width: "100%" }}>
          Failed to add blog. Please try again!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddBlog;