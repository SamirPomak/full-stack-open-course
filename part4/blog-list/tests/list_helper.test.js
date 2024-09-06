const { test, describe } = require('node:test');
const assert = require('node:assert');
const {
  totalLikes,
  dummy,
  favoriteBlog,
  mostBlogs,
  mostLikes,
} = require('../utils/list_helper');

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
];

test('dummy returns one', () => {
  const blogs = [];

  const result = dummy(blogs);
  assert.strictEqual(result, 1);
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(totalLikes([]), 0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    assert.strictEqual(totalLikes(listWithOneBlog), 5);
  });

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(totalLikes(blogs), 36);
  });
});

describe('favorite blog', () => {
  test('of empty list is undefined', () => {
    assert.strictEqual(favoriteBlog([]), undefined);
  });

  test('when list has only one blog, equals the likes of that', () => {
    assert.deepStrictEqual(favoriteBlog(listWithOneBlog), {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test('of a bigger list is calculated right', () => {
    assert.deepStrictEqual(favoriteBlog(blogs), {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    });
  });
});

describe('author with most blogs', () => {
  test('of empty list is undefined', () => {
    assert.strictEqual(mostBlogs([]), undefined);
  });

  test('when list has only one blog, shows correctly the author and count', () => {
    assert.deepStrictEqual(mostBlogs(listWithOneBlog), {
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    });
  });

  test('of a bigger list is calculated right', () => {
    assert.deepStrictEqual(mostBlogs(blogs), {
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });
});

describe('author with most likes', () => {
  test('of empty list is undefined', () => {
    assert.strictEqual(mostLikes([]), undefined);
  });

  test('when list has only one blog, shows correctly the author and count', () => {
    assert.deepStrictEqual(mostLikes(listWithOneBlog), {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test('of a bigger list is calculated right', () => {
    assert.deepStrictEqual(mostLikes(blogs), {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });
});
