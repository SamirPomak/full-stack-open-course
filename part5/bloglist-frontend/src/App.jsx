import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import './App.css';
import BlogForm from './components/BlogForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notificationConfig, setNotificationConfig] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
    setUser(loginService.getCurrentLoggedInUser());
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
    }
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

  return (
    <div>
      <h2>{user ? 'blogs' : 'log in to application'}</h2>
      <Notification config={notificationConfig} />
      {user && (
        <div>
          <p>
            {user.username} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>
          <BlogForm raiseNotification={raiseNotification} setBlogs={setBlogs} />
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
      {!user && (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setPassword={setPassword}
          setUsername={setUsername}
        />
      )}
    </div>
  );
};

export default App;
