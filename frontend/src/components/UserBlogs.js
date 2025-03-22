import React, { useEffect, useState } from "react";
import axios from "axios";
import Blog from "./Blog";
import Grid from "@mui/material/Grid";

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const id = localStorage.getItem("userId");

  const fetchUserBlogs = async () => {
    if (!id) {
      console.error("User ID not found in localStorage");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/blog/user/${id}`);
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error("Error fetching user blogs:", err);
    }
  };

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  const handleDelete = (id) => {
    setBlogs((prev) => prev.filter((blog) => blog._id !== id));
  };

  return (
    <Grid container spacing={3} sx={{ padding: 3 }}>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Blog
              id={blog._id}
              title={blog.title}
              description={blog.description}
              image={blog.image}
              userName={blog.user?.name || "Unknown"} // Fixed potential undefined error
              isUser={true}
              onDelete={handleDelete}
            />
          </Grid>
        ))
      ) : (
        <p>No blogs found.</p>
      )}
    </Grid>
  );
};

export default UserBlogs;
