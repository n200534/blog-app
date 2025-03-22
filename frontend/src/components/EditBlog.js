import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({ title: "", description: "", image: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Check token expiration on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in again.");
      navigate("/auth");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/auth");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setError("Invalid token. Please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/auth");
    }
  }, [navigate]);

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in again.");
          navigate("/auth");
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/blog/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlog({
          title: res.data.blog.title,
          description: res.data.blog.description,
          image: res.data.blog.image,
        });
      } catch (err) {
        console.error("Error fetching blog:", err);
        if (err.response && err.response.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate("/auth");
        } else {
          setError("Failed to load blog details.");
        }
      }
    };
    fetchBlog();
  }, [id, navigate]);

  // Handle blog update
  const handleUpdate = async () => {
    setError("");
    setSuccess(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in again.");
      navigate("/auth");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/blog/${id}`,
        blog,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Update Response:", response.data);
      setSuccess(true);

      setTimeout(() => navigate("/"), 4000); // Redirect to home after 2 seconds
    } catch (err) {
      console.error("Error updating blog:", err);

      if (err.response) {
        console.log("Error Response:", err.response);

        if (err.response.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate("/auth");
        } else {
          setError(err.response.data.message || "Error updating blog.");
        }
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  return (
    <Container sx={{ width: "50%", mt: 3, p: 3, boxShadow: "5px 5px 15px rgba(0,0,0,0.2)", borderRadius: "10px" }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
        Edit Blog
      </Typography>

      {success && <Alert severity="success">Blog updated successfully!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={blog.title}
        onChange={(e) => setBlog({ ...blog, title: e.target.value })}
      />
      <TextField
        label="Description"
        fullWidth
        multiline
        rows={4}
        margin="normal"
        value={blog.description}
        onChange={(e) => setBlog({ ...blog, description: e.target.value })}
      />
      <TextField
        label="Image URL"
        fullWidth
        margin="normal"
        value={blog.image}
        onChange={(e) => setBlog({ ...blog, image: e.target.value })}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, width: "100%" }}
        onClick={handleUpdate}
      >
        Update Blog
      </Button>
    </Container>
  );
};

export default EditBlog;