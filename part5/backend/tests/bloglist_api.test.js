const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('../utils/test_helper');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Blog = require('../models/blog');

let token;

beforeAll(async () => {
	await User.deleteMany({});

	const validUser = {
		username: 'jonny',
		password: '123',
		name: 'Jonny B. Good',
	};

	await api.post('/api/users').send({
		username: validUser.username,
		password: validUser.password,
		name: validUser.name,
	});
	const login = await api.post('/api/login').send({
		username: validUser.username,
		password: validUser.password,
	});
	token = login.body.token;
});

beforeEach(async () => {
	await Blog.deleteMany({});

	const blogObjects = helper.initialPosts.map((blog) => new Blog(blog));
	const promiseArray = blogObjects.map((blog) => blog.save());
	await Promise.all(promiseArray);
});

test('posts are returned as json', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/);
});

test('all posts are returned', async () => {
	const response = await api.get('/api/blogs');

	expect(response.body).toHaveLength(helper.initialPosts.length);
});

test('a specific post is within the returned notes', async () => {
	const response = await api.get('/api/blogs');

	const titles = response.body.map((r) => r.title);
	expect(titles).toContain('Cool Post 5');
});

test('a valid post can be added', async () => {
	const newBlog = {
		title: 'Cool Post 22',
		author: 'Jonny B Good',
		url: 'https://fullstackopen.com/en/part4/',
		likes: 12,
	};

	await api
		.post('/api/blogs')
		.set('Authorization', `bearer ${token}`)
		.send(newBlog)
		.expect(200)
		.expect('Content-Type', /application\/json/);

	const postsAtEnd = await helper.postsInDb();
	expect(postsAtEnd).toHaveLength(helper.initialPosts.length + 1);
});

test('post without title is not added', async () => {
	const newPost = {
		title: '',
		author: 'Jack Awesome',
		url: 'https://ismelich.tech/',
		likes: 10,
	};

	await api
		.post('/api/blogs')
		.set('Authorization', `bearer ${token}`)
		.send(newPost)
		.expect(400);

	const postsAtEnd = await helper.postsInDb();

	expect(postsAtEnd).toHaveLength(helper.initialPosts.length);
});

test('a post can be deleted', async () => {
	const postsAtStart = await helper.postsInDb();
	const postToDelete = postsAtStart[0];
	console.log('POST TO DELETE', postToDelete.id);
	await api
		.delete(`/api/blogs/${postToDelete.id}`)
		.set('Authorization', `bearer ${token}`)
		.expect(204);

	const postsAtEnd = await helper.postsInDb();

	expect(postsAtEnd).toHaveLength(helper.initialPosts.length - 1);

	const titles = postsAtEnd.map((r) => r.title);

	expect(titles).not.toContain(postToDelete.title);
});

test('verifies that the unique identifier property of the blog posts is named id', async () => {
	const post = await api.get('/api/blogs');
	expect(post.body[0].id).toBeDefined();
});

test('testing default like is 0, when no likes are available', async () => {
	const noLikes = new Blog({
		title: 'Cool Post 55',
		author: 'Jack Awesome',
		url: 'https://ismelich.tech/',
	});

	await api
		.post('/api/blogs')
		.set('Authorization', 'bearer ' + token)
		.send(noLikes)
		.expect(200)
		.expect('Content-Type', /application\/json/);

	const postsAtEnd = await helper.postsInDb();
	const posts = await postsAtEnd.find((post) => post.title === 'Cool Post 55');

	expect(posts.likes).toEqual(0);
});

test('title and url properties are missing from the request data, respond with 400 ', async () => {
	const badPost = new Blog({
		author: 'Jack Awwesome',
		likes: 2,
	});

	await api
		.post('/api/blogs')
		.set('Authorization', 'bearer ' + token)
		.send(badPost)
		.expect(400);
});

test('unique identifier property of the blog posts is named id not _id', async () => {
	const postsAtEnd = await helper.postsInDb();
	const post = postsAtEnd[0];

	expect(post.id).toBeDefined();
});

test('update the blog post', async () => {
	const post = {
		title: 'Cool Post 55',
		author: 'Jack Awwesome',
		url: 'https://ismelich.tech/',
		likes: 5,
	};

	const postsAtStart = await helper.postsInDb();
	const postToUpdate = postsAtStart[0];

	await api.put(`/api/blogs/${postToUpdate.id}`).send(post).expect(200);

	const postsAtEnd = await helper.postsInDb();
	const postAfterUpdate = postsAtEnd[0];

	expect(postAfterUpdate.title).toEqual(post.title);
	expect(postAfterUpdate.author).toEqual(post.author);
	expect(postAfterUpdate.url).toEqual(post.url);
	expect(postAfterUpdate.likes).toEqual(post.likes);
});

describe('most blogs entires and most likes', () => {
	const blogs = [
		{
			likes: 17,
			title: 'Cool Post 55',
			author: 'Edsger W. Dijkstra',
			url: 'https://ismelich.tech/',
		},
		{
			likes: 5,
			title: 'Cool Post 55',
			author: 'Jack Awwesome',
			url: 'https://ismelich.tech/',
		},
		{
			likes: 6,
			title: 'Cool Post 6',
			author: 'Jack Awesome',
			url: 'https://ismelich.tech/',
		},
		{
			likes: 3,
			title: 'Cool Post 1',
			author: 'Robert C. Martin',
			url: 'https://ismelich.tech/',
		},
		{
			likes: 3,
			title: 'Cool Post 2',
			author: 'Robert C. Martin',
			url: 'https://ismelich.tech/',
		},
		{
			likes: 3,
			title: 'Cool Post 3',
			author: 'Robert C. Martin',
			url: 'https://ismelich.tech/',
		},
	];

	test('returns the author who has the largest amount of blogs', async () => {
		const authorWithMostBlogs = {
			author: 'Robert C. Martin',
			blogs: 3,
		};

		const result = helper.mostBlogs(blogs);
		expect(result).toEqual(authorWithMostBlogs);
	});

	test('blog posts with the largest amount of likes', async () => {
		const authorWithMostLikes = {
			author: 'Edsger W. Dijkstra',
			likes: 17,
		};

		const result = helper.mostLikes(blogs);
		expect(result).toEqual(authorWithMostLikes);
	});
});

describe('when there is initially one user in db', () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash('sekret', 10);
		const user = new User({ username: 'root', passwordHash });

		await user.save();
	});

	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'salainen',
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

		const usernames = usersAtEnd.map((u) => u.username);
		expect(usernames).toContain(newUser.username);
	});

	test('creation fails with proper statuscode and message if username already taken', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 'salainen',
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('`username` to be unique');

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});
});

describe('username and password must be at least 3 characters long', () => {
	test('password less than 3 chars', async () => {
		const invalidUser = {
			username: 'jonny',
			password: '12',
			name: 'Jonny B. Good',
		};

		const result = await api.post('/api/users').send(invalidUser);
		expect(400);
		expect(result.text).toContain(
			'Username and Password must be at least 3 characters long!'
		);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
