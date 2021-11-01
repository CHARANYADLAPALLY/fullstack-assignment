const express = require('express');
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const blogsRouter = express.Router();

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
	response.json(blogs);
});

blogsRouter.get('/:id', async (request, response, next) => {
	const post = await Note.findById(request.params.id);
	if (post) {
		response.json(post);
	} else {
		response.status(404).end();
	}
});

blogsRouter.post('/', async (request, response, next) => {
	const body = request.body;
	const decodedToken = jwt.verify(request.token, process.env.SECRET);

	if (!request.token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' });
	}
	const user = await User.findById(decodedToken.id);

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user._id,
	});

	if (!body.title && !body.url) {
		return response.status(400).end();
	}

	const savedPost = await blog.save();
	user.blogs = user.blogs.concat(savedPost._id);
	response.json(savedPost.toJSON());
});

blogsRouter.delete('/:id', async (request, response, next) => {
	try {
		const decodedToken = jwt.verify(request.token, process.env.SECRET);
		if (!decodedToken.id) {
			return response.status(401).json({ error: 'token missing or invalid' });
		}
		const user = await User.findById(decodedToken.id);
		const blog = await Blog.findById(request.params.id);

		if (blog.user.toString() === user.id.toString()) {
			await Blog.findByIdAndRemove(request.params.id);
			return response.status(204).end();
		}
		return response.status(401).json({ error: 'invalid token' });
	} catch (error) {
		next(error);
	}
});

blogsRouter.put('/:id', async (request, response) => {
	const body = request.body;
	const post = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
	};

	const getPost = await Blog.findByIdAndUpdate(request.params.id, post, {
		new: true,
	});
	response.json(getPost.toJSON());
});

module.exports = blogsRouter;
