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
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import BlogsView from './components/BlogsView';
import UsersView from './components/UsersView';
import UserView from './components/User';

const App = () => {
  const [notification, notificationDispatch, raiseNotification] =
    useContext(NotificationContext);
  const [user, userDispatch] = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const loginFormRef = useRef();
  const blogFormRef = useRef();

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
          <nav
            style={{
              background: 'lightgray',
              display: 'flex',
              gap: '15px',
              margin: '10px 10px 10px 0px',
              padding: '10px',
            }}
          >
            <Link to="/blogs">blogs</Link>
            <Link to="/users">users</Link>
            {user.username} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </nav>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm handleCreateNewBlog={handleCreateNewBlog} />
          </Togglable>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Navigate replace to="/blogs" />} />
        <Route path="/blogs" element={<BlogsView />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/users" element={<UsersView />} />
        <Route path="/users/:id" element={<UserView />} />
      </Routes>
    </div>
  );
};

export default App;
