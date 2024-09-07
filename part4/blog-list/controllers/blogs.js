const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body;
  if (!body.likes) {
    body.likes = 0;
  }

  const blog = new Blog(body);
  const result = await blog.save();

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
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

module.exports = blogsRouter;
