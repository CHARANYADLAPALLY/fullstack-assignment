const _ = require('lodash');

const dummy = (blogs) => {
	return 1;
};

const maxLikes = (blogs) => {
	const reducer = (accumulator, likes) => accumulator + likes;
	return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
	const likes = blogs.map((blog) => blog.likes);
	const likesIndex = likes.indexOf(Math.max(...likes));

	return blogs[likesIndex];
};

module.exports = {
	dummy,
	maxLikes,
	favoriteBlog,
};
