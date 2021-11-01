import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/blogs';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const postBlog = async (newBlog, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };
  const result = await axios.post(baseUrl, newBlog, config);
  return result.data;
};

const updateBlogPost = async (id, updatedBlog) => {
  const result = await axios.put(`${baseUrl}/${id}`, updatedBlog);

  return result.data;
};

const removeBlogPost = async (id, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };

  const result = await axios.delete(`${baseUrl}/${id}`, config);
  return result.status;
};

export default { getAll, postBlog, updateBlogPost, removeBlogPost };
