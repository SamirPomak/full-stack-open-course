import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import './App.css';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notificationConfig, setNotificationConfig] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const loginFormRef = useRef();
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
    const user = loginService.getCurrentLoggedInUser();
    if (user) {
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogsUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
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

  const handleCreateNewBlog = ({ title, author, url }) => {
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
        blogFormRef.current.toggleVisibility();
      });
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogsUser');
    setUser(null);
    raiseNotification({
      message: 'you have been logged out',
      severity: 'success',
    });
  };

  const raiseNotification = (config) => {
    setNotificationConfig(config);
    setTimeout(() => {
      setNotificationConfig(null);
    }, 5000);
  };

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };

    await blogService.update(updatedBlog);
    const updatedBlogs = await blogService.getAll();
    setBlogs(updatedBlogs);
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.deleteBlog(blog.id);
      const updatedBlogs = await blogService.getAll();
      setBlogs(updatedBlogs);
      raiseNotification({
        message: `Removed blog ${blog.title} by ${blog.author}`,
        severity: 'success',
      });
    }
  };

  return (
    <div>
      <h2>Blogs</h2>
      <Notification config={notificationConfig} />
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
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            user={user}
          />
        ))}
    </div>
  );
};

export default App;
