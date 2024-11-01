import { useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import blogService from '../services/blogs.js';
import NotificationContext from '../contexts/NotificationContext';

const Blog = () => {
  const id = useParams().id;
  const [user] = useContext(UserContext);
  const [, , raiseNotification] = useContext(NotificationContext);
  const queryClient = useQueryClient();
  const { isPending, data: blogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const blog = blogs?.find((blog) => blog.id === id);
  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (upvotedBlog) => {
      const blogs = queryClient.getQueryData(['blogs']);
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((blog) => {
          if (blog.id === upvotedBlog.id) {
            return upvotedBlog;
          }

          return blog;
        })
      );
      raiseNotification({
        message: `A like added to ${upvotedBlog.title}!`,
        severity: 'success',
      });
    },
    onError: (e) => {
      raiseNotification({
        message: `Could not update blog because of ${e?.message}`,
        severity: 'error',
      });
    },
  });
  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: (_, id) => {
      const blogs = queryClient.getQueryData(['blogs']);
      const deletedBlog = blogs.find((b) => b.id === id);

      queryClient.setQueryData(
        ['blogs'],
        blogs.filter((blog) => blog.id !== id)
      );
      raiseNotification({
        message: `Removed blog ${deletedBlog.title} by ${deletedBlog.author}`,
        severity: 'success',
      });
    },
    onError: (e) => {
      raiseNotification({
        message: `Could not delete blog because of ${e?.message}`,
        severity: 'error',
      });
    },
  });

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
    updateBlogMutation.mutate(updatedBlog);
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlogMutation.mutate(blog.id);
    }
  };

  if (isPending) {
    return <div>Loading blog...</div>;
  }

  if (!blog) {
    return <div>No blog found!</div>;
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a data-testid="url" href={blog.url} target="_blank" rel="noreferrer">
        {blog.url}
      </a>
      <p data-testid="likes">
        {blog.likes} likes{' '}
        <button onClick={() => handleLike(blog)}>like</button>
      </p>
      <p>added by {blog.user.username}</p>
      {blog?.user?.username === user?.username && (
        <button onClick={() => handleDelete(blog)}>remove</button>
      )}
    </div>
  );
};

export default Blog;
