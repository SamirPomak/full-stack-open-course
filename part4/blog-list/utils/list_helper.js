const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, current) => acc + current.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!blogs.length) {
    return;
  }

  const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
  const { title, author, likes } = blogs.find(
    (blog) => blog.likes === maxLikes
  );

  return { title, author, likes };
};

const mostBlogs = (blogs) => {
  if (!blogs.length) {
    return;
  }

  const grouped = _.groupBy(blogs, (blog) => blog.author);
  const sorted = Object.entries(grouped).sort(
    (a, b) => b[1].length - a[1].length
  );
  const [author, blogList] = sorted[0];
  return { author, blogs: blogList.length };
};

const mostLikes = (blogs) => {
  if (!blogs.length) {
    return;
  }

  const grouped = _.groupBy(blogs, (blog) => blog.author);
  const sorted = Object.entries(grouped)
    .map(([author, blogs]) => {
      const likes = blogs.reduce((acc, curr) => acc + curr.likes, 0);
      return [author, likes];
    })
    .sort((a, b) => b[1] - a[1]);
  const [author, likes] = sorted[0];

  return { author, likes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
