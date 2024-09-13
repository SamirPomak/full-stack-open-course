const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  if (!body.likes) {
    body.likes = 0;
  }

  const user = request.user;
  body.user = user._id;

  const blog = new Blog(body);
  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();

  response.status(201).json(result);
});

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  );
  response.json(updatedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
    user.blogs = user.blogs.filter((id) => blog._id !== id);
    await user.save();
    response.status(204).end();
  } else {
    response.status(401).json({ error: 'Unauthorized to delete' });
  }
});

module.exports = blogsRouter;
