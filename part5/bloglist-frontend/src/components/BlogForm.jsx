import { useState } from 'react';
import blogService from '../services/blogs';

const BlogForm = ({ raiseNotification, setBlogs }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreateNewBlog = (event) => {
    event.preventDefault();
    blogService
      .create({ title, author, url })
      .then(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs));
        raiseNotification({
          message: `A new blog ${title} by ${author} added!`,
          severity: 'success',
        });
      })
      .catch((e) => {
        raiseNotification({
          message: `Could not add blog because of ${e?.message}`,
          severity: 'error',
        });
      })
      .finally(() => {
        setAuthor('');
        setTitle('');
        setUrl('');
      });
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateNewBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
