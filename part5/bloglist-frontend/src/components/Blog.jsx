import { useState } from 'react';
import PropTypes from 'prop-types';

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
};

const Blog = ({ blog, handleLike, user, handleDelete }) => {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  return (
    <div style={blogStyle}>
      <p>
        {blog.title} {blog.author}
      </p>
      <button onClick={() => setIsDetailsVisible(!isDetailsVisible)}>
        {isDetailsVisible ? 'hide' : 'view'}
      </button>
      {isDetailsVisible && (
        <>
          <p data-testid="url">{blog.url}</p>
          <p data-testid="likes">
            {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
          </p>
          <p>{blog.user.username}</p>
          {blog.user.username === user.username && (
            <button onClick={() => handleDelete(blog)}>remove</button>
          )}
        </>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
export default Blog;
