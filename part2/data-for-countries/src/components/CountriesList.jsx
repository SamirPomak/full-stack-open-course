import { useEffect, useState } from 'react';
import CountryDetails from './CountryDetails';

const CountriesList = ({ countries, query }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedCountry(null);
  }, [query]);

  if (!filteredCountries.length) {
    return <p>No countries found!</p>;
  }

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (filteredCountries.length === 1) {
    const country = filteredCountries[0];

    return <CountryDetails country={country} />;
  }

  return (
    <>
      {filteredCountries.map((country) => {
        return (
          <div key={country.fifa + country.name.common}>
            <span>{country.name.common}</span>{' '}
            <button onClick={() => setSelectedCountry(country)}>show</button>
          </div>
        );
      })}
      {selectedCountry && <CountryDetails country={selectedCountry} />}
    </>
  );
};

export default CountriesList;
