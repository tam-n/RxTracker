import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { DataContext } from './App';
import { useEffect, useState } from 'react';

export default function MedicationInfo() {
  const { selected } = useContext(DataContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLists() {
      try {
        const response = await fetch('/api/lists');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
      } catch (error) {
        setError(error);
      }
    }
    fetchLists();
  }, []);

  if (!selected) {
    return <div>No medication selected</div>;
  }

  function handleSubmit(event) {
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="bg-willow-gray layout-center text-rust-gray">
      <div className="flex justify-between p-10">
        <span className="text-3xl text-merriweather">
          {selected.openfda.generic_name[0].toLowerCase()}
        </span>
        <form onSubmit={handleSubmit}>
          <span className="text-opensans justify-end flex items-center">
            <select className="rounded-md p-1 w-1/5" placeholder="Route">
              <option value="" disabled selected hidden>
                Route
              </option>
              {selected.openfda.route.map((route) => {
                return <option>{route}</option>;
              })}
            </select>
            <input
              className="m-3 rounded-md p-1 w-1/5"
              placeholder="Dosage..."></input>
            <select>
              <option value="" disabled selected hidden>
                List
              </option>
              <option>Hi</option>
            </select>
          </span>
        </form>
      </div>
      <div className="text-2xl text-merriweather px-10 py-3">
        Used for
        <div className="text-opensans text-base p-3">
          {selected.purpose && selected.indications_and_usage}
        </div>
      </div>
      <div className="text-2xl text-merriweather px-10 py-3">
        Common side effects
        <div className="text-opensans text-base p-3">
          {selected.adverse_reactions}
        </div>
      </div>
      <div className="text-2xl text-merriweather px-10 py-3">
        Directions for use
        <div className="text-opensans text-base p-3">
          {selected.instructions_for_use}
        </div>
      </div>
      <div className="text-2xl text-merriweather px-10 py-3">
        Important Safety Information
        <div className="text-opensans text-base p-3">
          {selected.warnings_and_cautions}
        </div>
      </div>
    </div>
  );
}
