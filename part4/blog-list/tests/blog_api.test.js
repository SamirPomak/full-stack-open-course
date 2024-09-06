const { test, after, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const Blog = require('../models/blog');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('../utils/test_helper');
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe('blog list api', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are two blogs initially', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, 2);
  });

  test('a blog has an id property and not _id', async () => {
    const response = await api.get('/api/blogs');
    assert('id' in response.body[0]);
    assert.strictEqual('_id' in response.body[0], false);
  });

  test('POST request successfully creates a new blog post', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const totalBlogs = await helper.blogsInDB();
    assert.strictEqual(totalBlogs.length, helper.initialBlogs.length + 1);

    const contents = totalBlogs.map((b) => b.title);
    assert(contents.includes('Canonical string reduction'));
  });

  test('POST request with missing likes prop defaults to 0 likes', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    };

    const response = await api.post('/api/blogs').send(newBlog);
    assert.strictEqual(response.body.likes, 0);
  });

  test('POST request with missing title returns status 400 Bad Request', async () => {
    const newBlog = {
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    };

    await api.post('/api/blogs').send(newBlog).expect(400);
  });

  test('POST request with missing url returns status 400 Bad Request', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
    };

    await api.post('/api/blogs').send(newBlog).expect(400);
  });
});

after(async () => {
  await mongoose.connection.close();
});
