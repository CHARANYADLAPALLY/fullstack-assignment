const _ = require('lodash');
const Blog = require('../models/blog');
const User = require('../models/user');

const initialPosts = [
	{
		title: 'Cool Post 5',
		author: 'Jack Awesome',
		url: 'https://ismelich.tech/',
		likes: 2,
	},

	{
		title: 'Cool Post 6',
		author: 'Jack Awesome',
		url: 'https://ismelich.tech/',
		likes: 6,
	},
];

const nonExistingId = async () => {
	const post = new Blog({
		title: 'Cool Post 10',
		author: 'Jack Awesome',
		url: 'https://ismelich.tech/',
		likes: 24,
	});
	await post.save();
	await post.remove();

	return post._id.toString();
};

const postsInDb = async () => {
	const posts = await Blog.find({});
	return posts.map((post) => post.toJSON());
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((u) => u.toJSON());
};

const mostBlogs = (blogs) => {
	const blogsEntries = _.countBy(blogs, 'author');
	const getAuthorName = _.maxBy(_.keys(blogsEntries), (o) => blogsEntries[o]);
	const getAuthorWithMostBlogs = _.pick(blogsEntries, getAuthorName);
	let author = {};

	author['author'] = getAuthorName;
	author['blogs'] = getAuthorWithMostBlogs[getAuthorName];

	return author;
};

const mostLikes = (blogs) => {
	const authorWithMostLikes = _(blogs)
		.groupBy('author')
		.map((group, author) => {
			return {
				author: author,
				likes: _.sum(_.map(group, 'likes')),
			};
		})
		.value();
	return _.maxBy(authorWithMostLikes, 'likes');
};

module.exports = {
	initialPosts,
	nonExistingId,
	postsInDb,
	usersInDb,
	mostBlogs,
	mostLikes,
};
