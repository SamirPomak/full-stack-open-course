const { test, after, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('../utils/test_helper');
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();
});

describe('creating users', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'admin',
      name: 'Admin Admin',
      password: 'admin',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('creation fails when unique username is not provided', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Admin Admin',
      password: 'admin',
    };

    const response = await api.post('/api/users').send(newUser).expect(400);
    assert.match(response.body.error, /unique/);
    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails when username is not provided', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'Admin Admin',
      password: 'admin',
    };

    const response = await api.post('/api/users').send(newUser).expect(400);
    assert.match(response.body.error, /characters long/);
    let usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails when username is not 3 chars long', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'as',
      name: 'Admin Admin',
      password: 'admin',
    };

    const response = await api.post('/api/users').send(newUser).expect(400);
    assert.match(response.body.error, /characters long/);
    let usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
  test('creation fails when password is not provided', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'as',
      name: 'Admin Admin',
    };

    const response = await api.post('/api/users').send(newUser).expect(400);
    assert.match(response.body.error, /characters long/);
    let usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails when password is not 3 chars long', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'asd',
      name: 'Admin Admin',
      password: 'ad',
    };

    const response = await api.post('/api/users').send(newUser).expect(400);
    assert.match(response.body.error, /characters long/);
    let usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
