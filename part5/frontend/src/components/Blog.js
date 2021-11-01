import React, { useState } from 'react';

const Blog = ({ blog, countLikes, username, removeBlogPost }) => {
  const [visibility, setVisibility] = useState(false);
  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    width: 270,
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div className={'blog-heading'}>
        {blog.title} by {blog.author}
        <button className='toggle-button' onClick={toggleVisibility}>{visibility ? 'hide' : 'view'}</button>
      </div>
      {visibility && (
        <div className='blog-details'>
          <p>
            link:
            <a href={blog.url} target='_blank' rel='noopener noreferrer'>
              {blog.url}
            </a>
          </p>
          <p>
            likes {blog.likes}{' '}
            <button className='like-button' onClick={() => countLikes(blog)}>like</button>
          </p>
          <p>posted by {blog.user.name}</p>
          {blog.user.username === username && (
            <button id='remove-button' onClick={() => removeBlogPost(blog)}>Remove</button>
          )}
        </div>
      )}
      <br />
    </div>
  );
};

export default Blog;
