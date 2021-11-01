import React, { useState, useEffect, useRef } from 'react';
import Blog from './Blog';
import blogService from '../services/blogs';
import BlogForm from './BlogForm';
import Togglable from './Togglable';

const Blogs = ({ user, setUser, setNotification, setErrorMessage }) => {
  const [blogs, setBlogs] = useState([]);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const hideBlogForm = () => {
    blogFormRef.current.toggleVisibility();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
  };

  const countLikes = async (blog) => {
    try {
      const updatedBlog = await blogService.updateBlogPost(blog.id, {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
      });
      setBlogs(blogs.map((item) => (item.id === blog.id ? updatedBlog : item)));
    } catch (error) {
      setNotification('Something went wrong!');
      setErrorMessage('error');
    }
  };

  const removeBlogPost = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        const status = await blogService.removeBlogPost(blog.id, user.token);
        if (status === 204) {
          setBlogs(blogs.filter((item) => item.id !== blog.id));
          setNotification(`Blog ${blog.title} by ${blog.author} removed`);
          setErrorMessage('ok');
        }
      } catch (exception) {
        setNotification(
          `${blog.title} could not be delete, something went wrong.`
        );
        setErrorMessage('error');
      }
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button id='logout-button' onClick={handleLogout}> logout </button>
      </p>
      <Togglable label='Create new blog' ref={blogFormRef}>
        <BlogForm
          setBlogs={setBlogs}
          token={user.token}
          setNotification={setNotification}
          setErrorMessage={setErrorMessage}
          hideBlogForm={hideBlogForm}
        />
      </Togglable>
      <div id='blogs'>
        {[]
          .concat(blogs)
          .sort((firstBlog, secondBlog) => secondBlog.likes - firstBlog.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              username={user.username}
              countLikes={countLikes}
              removeBlogPost={removeBlogPost}
            />
          ))}
      </div>
    </div>
  );
};

export default Blogs;
