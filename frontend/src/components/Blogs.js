import React, { useEffect, useState } from "react";
import axios from "axios";
import Blog from "./Blog";
import Grid from "@mui/material/Grid";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blog");
      setBlogs(res.data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
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
              userName={blog.user.name}
              isUser={localStorage.getItem("userId") === blog.user._id}
              onDelete={handleDelete}
            />
          </Grid>
        ))
      ) : (
        <p>Loading blogs...</p>
      )}
    </Grid>
  );
};

export default Blogs;
