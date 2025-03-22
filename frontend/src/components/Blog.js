import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const Blog = ({ id, title, description, image, userName, isUser, onDelete }) => {
  console.log("Rendering Blog:", { id, title, description, image, userName, isUser });

  if (!userName) {
    return <p>Error: Missing user data</p>; // Prevent crashes
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/blog/${id}`);
      onDelete(id);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <Card sx={{ maxWidth: 345, margin: "auto", mt: 2, padding: 2, boxShadow: "10px 10px 20px #ccc" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {userName ? userName[0].toUpperCase() : "?"}
          </Avatar>
        }
        action={
          isUser && (
            <>
              <IconButton onClick={() => (window.location.href = `/edit/${id}`)}>
                <EditIcon color="primary" />
              </IconButton>
              <IconButton onClick={handleDelete}>
                <DeleteIcon color="error" />
              </IconButton>
            </>
          )
        }
        title={title}
      />
      <CardMedia component="img" height="194" image={image} alt="Blog Image" />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Blog;
