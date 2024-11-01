import { useQuery } from '@tanstack/react-query';
import userService from '../services/users';
import { useParams } from 'react-router-dom';

const UserView = () => {
  const id = useParams().id;
  const { isPending, data: users } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  const user = users?.find((user) => user.id === id);

  if (isPending) {
    return <div>Loading user...</div>;
  }

  if (!user) {
    return <div>No user found!</div>;
  }

  return (
    <div>
      <h2>{user.username}</h2>
      <h3>{user.blogs.length ? 'Added blogs:' : 'No blogs added!'}</h3>
      <ul>
        {user.blogs.map((blog) => {
          return <li key={blog.id}>{blog.title}</li>;
        })}
      </ul>
    </div>
  );
};

export default UserView;
