import { useState, useEffect, useRef, useContext } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import './App.css';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import NotificationContext from './contexts/NotificationContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import UserContext from './contexts/UserContext';

const App = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext);
  const [user, userDispatch] = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const loginFormRef = useRef();
  const blogFormRef = useRef();
  const { isPending, data: blogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();
  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries(['blogs']);
      raiseNotification({
        message: `A new blog ${newBlog.title} by ${newBlog.author} added!`,
        severity: 'success',
      });
    },
    onError: (e) => {
      raiseNotification({
        message: `Could not add blog because of ${e?.message}`,
        severity: 'error',
      });
    },
    onSettled: () => {
      blogFormRef.current.toggleVisibility();
    },
  });
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
  useEffect(() => {
    const user = loginService.getCurrentLoggedInUser();
    if (user) {
      userDispatch({ type: 'SET_USER', payload: user });
      blogService.setToken(user.token);
    }
  }, [userDispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogsUser', JSON.stringify(user));
      blogService.setToken(user.token);
      userDispatch({ type: 'SET_USER', payload: user });
      setUsername('');
      setPassword('');
      raiseNotification({
        message: 'you have been logged in',
        severity: 'success',
      });
    } catch (exception) {
      console.log(exception);
      raiseNotification({
        message: 'wrong username or password',
        severity: 'error',
      });
    } finally {
      loginFormRef.current.toggleVisibility();
    }
  };

  const handleCreateNewBlog = (newBlog) => {
    createBlogMutation.mutate(newBlog);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogsUser');
    userDispatch({ type: 'SET_USER', payload: null });
    raiseNotification({
      message: 'you have been logged out',
      severity: 'success',
    });
  };

  const raiseNotification = (config) => {
    notificationDispatch({ type: 'SET_NOTIFICATION', payload: config });
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR_NOTIFICATION', payload: config });
    }, 5000);
  };

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

  return (
    <div>
      <h2>Blogs</h2>
      {notification.message && <Notification config={notification} />}
      {!user && (
        <Togglable buttonLabel="login" ref={loginFormRef}>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
            setPassword={setPassword}
            setUsername={setUsername}
          />
        </Togglable>
      )}
      {user && (
        <div>
          <p>
            {user.username} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm handleCreateNewBlog={handleCreateNewBlog} />
          </Togglable>
        </div>
      )}
      {isPending ? (
        <div>Loading blogs...!</div>
      ) : (
        blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleDelete={handleDelete}
            />
          ))
      )}
    </div>
  );
};

export default App;
