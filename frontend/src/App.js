import React, { useEffect } from 'react';
import Header from './components/Header';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Blogs from './components/Blogs';
import UserBlogs from './components/UserBlogs';
import Blogdetail from './components/Blogdetail';
import Addblog from './components/Addblog';
import Home from './components/Home';
import { useSelector } from 'react-redux';
import EditBlog from './components/EditBlog';
import { jwtDecode } from 'jwt-decode'; // Correct import

export default function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  console.log(isLoggedIn);

  // Check token expiration on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token); // Use the named export
        if (decoded.exp < Date.now() / 1000) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          window.location.href = "/auth";
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/auth";
      }
    }
  }, []);

  return (
    <React.Fragment>
      <header>
        <Header />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/myblogs" element={isLoggedIn ? <UserBlogs /> : <Navigate to="/auth" />} />
          <Route path="/myblogs/:id" element={isLoggedIn ? <Blogdetail /> : <Navigate to="/auth" />} />
          <Route path="/addblog" element={isLoggedIn ? <Addblog /> : <Navigate to="/auth" />} />
          <Route path="/edit/:id" element={isLoggedIn ? <EditBlog /> : <Navigate to="/auth" />} />
        </Routes>
      </main>
    </React.Fragment>
  );
}