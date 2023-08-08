import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { DataContext } from './App';

export default function Searchable() {
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { setSelected } = useContext(DataContext);

  const fetchData = async (value) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.generic_name:${value}+openfda.brand_name:${value}&limit=5`
      );
      if (!response.ok) {
        throw new Error(
          response.status === 500
            ? 'Please enter a input'
            : `Could not find ${value}`
        );
      }
      const data = await response.json();
      console.log(data);
      setSearchResults(data.results);
      setError(null);
    } catch (error) {
      setError(error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    fetchData(input);
  };

  return (
    <>
      <div className="border bg-white w-15 h-15 rounded-2xl border-rust-gray flex items-center p-2 input-container">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          size="2xl"
          className="text-rust-gray"
        />
        <input
          className="border-none w-full h-full ml-3 text-xl focus:outline-0"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="ml-2" type="button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {searchResults.length > 0 ? (
        <div className="search-results">
          <ul className="results flex-column justify-center items-center">
            {searchResults.map((result) =>
              result.openfda.generic_name ? (
                <Link to="/info">
                  <li
                    key={result.openfda.product_ndc[1]}
                    onClick={() => setSelected(result)}
                    className="hover:bg-light-gray-sky truncate w-2/3 sm:w-1/3">
                    {result.openfda.generic_name} - {result.openfda.brand_name}{' '}
                    ({result.openfda.manufacturer_name})
                  </li>
                </Link>
              ) : null
            )}
          </ul>
        </div>
      ) : (
        <div>Enter generic or brand name of medication.</div>
      )}
    </>
  );
}
