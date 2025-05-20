import { useQuery } from '@apollo/client';
import { ALL_BOOKS, CURRENT_USER } from '../queries';

const RECCOMENDATIONS = (props) => {
  const { data, loading } = useQuery(ALL_BOOKS);
  const userQuery = useQuery(CURRENT_USER);

  if (!props.show) {
    return null;
  }

  if (loading || userQuery.loading) {
    return <div>Loading books...</div>;
  }

  return (
    <div>
      <h2>reccomendations</h2>
      <p>
        books in your favorite genre <b>{userQuery.data.me?.favoriteGenre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks
            .filter((book) =>
              userQuery.data.me.favoriteGenre
                ? book.genres.includes(userQuery.data.me?.favoriteGenre)
                : true
            )
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default RECCOMENDATIONS;
