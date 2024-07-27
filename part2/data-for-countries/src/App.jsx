import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import CountriesList from './components/CountriesList';

function App() {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => setCountries(response.data));
  }, []);

  return (
    <>
      <span>find countries</span>{' '}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <CountriesList countries={countries} query={query} />
    </>
  );
}

export default App;
