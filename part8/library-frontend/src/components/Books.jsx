import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';
import { useEffect, useState } from 'react';

const Books = (props) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { data, loading } = useQuery(ALL_BOOKS);

  useEffect(() => {
    if (data && data.allBooks) {
      const allGenres = data.allBooks
        .map((book) => book.genres)
        .flat()
        .filter((genre, index, array) => array.indexOf(genre) === index);
      setGenres(allGenres);
    }
  }, [data]);

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>Loading books...</div>;
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data?.allBooks
            .filter((book) =>
              selectedGenre ? book.genres.includes(selectedGenre) : true
            )
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">
              {genres.map((genre) => (
                <button key={genre} onClick={() => setSelectedGenre(genre)}>
                  {genre}
                </button>
              ))}
              <button onClick={() => setSelectedGenre(null)}>all genres</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Books;
