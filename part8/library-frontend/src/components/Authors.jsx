import { useMutation, useQuery } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';
import { useState } from 'react';

const Authors = (props) => {
  const authorsQuery = useQuery(ALL_AUTHORS);
  const [author, setAuthor] = useState('');
  const [born, setBorn] = useState(0);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n');
      props.setError(messages);
    },
  });
  if (!props.show) {
    return null;
  }

  if (authorsQuery.loading) {
    return <div>Loading authors...</div>;
  }

  const updateAuthor = (e) => {
    const name = author ? author : authorsQuery?.data?.allAuthors?.[0]?.name;
    e.preventDefault();
    editAuthor({ variables: { name, setBornTo: born } });
    setBorn(0);
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authorsQuery.data?.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={updateAuthor}>
        <div>
          name
          <select onChange={(e) => setAuthor(e.target.value)}>
            {authorsQuery.data?.allAuthors?.map((a) => {
              return (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
