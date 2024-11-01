import { useQuery } from '@tanstack/react-query';
import userService from '../services/users';
import { Link } from 'react-router-dom';

const UsersView = () => {
  const { isPending, data: users } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  if (isPending) {
    return <div>Loading users...</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th style={{ width: '50px' }}></th>
          <th>blogs created</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <Link to={`/users/${user.id}`}>{user.username}</Link>
            </td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersView;
