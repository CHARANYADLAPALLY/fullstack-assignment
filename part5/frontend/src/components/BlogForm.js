import React, { useState } from 'react';
import blogService from '../services/blogs';

const BlogForm = ({
  setBlogs,
  token,
  setNotification,
  setErrorMessage,
  hideBlogForm,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const createBlog = async (event) => {
    event.preventDefault();
    try {
      const blog = await blogService.postBlog({ title, author, url }, token);
      setBlogs((blogs) => blogs.concat(blog));
      setNotification(`A new blog post '${title}' has been added by ${author}`);
      setErrorMessage('ok');
      setTitle('');
      setAuthor('');
      setUrl('');
      hideBlogForm();
    } catch (error) {
      setNotification(
        'Blog post could not be added! Check if you filled all the formst out!'
      );
      setErrorMessage('error');
    }
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>
          title:
          <input
            id="title"
            value={title}
            name='Title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            id="author"
            value={author}
            name='Author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            id="url"
            value={url}
            name='URL'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <div>
          <button id="create-blog-button" type='submit'>create</button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
