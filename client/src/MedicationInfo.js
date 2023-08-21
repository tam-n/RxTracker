import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { DataContext } from './App';
import { useState } from 'react';

export default function MedicationInfo() {
  const data = useContext(DataContext);
  const { selected } = data;
  const [dosage, setDosage] = useState('');
  const [route, setRoute] = useState('');
  const [frequency, setFrequency] = useState('');
  const [selectedList, setSelectedList] = useState('');

  if (!selected) {
    return <div>No medication selected</div>;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const listId = selectedList;

      const medicationInfo = {
        medicationId: selected.id,
        genericName: selected.openfda.generic_name[0],
        dosage: dosage,
        route: route,
        frequency: frequency,
        listId: listId,
      };

      const response = await fetch(`/api/listContent/${listId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(medicationInfo),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      setDosage('');
      setRoute('');
      setFrequency('');
      setSelectedList('');
    } catch (error) {
      console.log('Error:', error.message);
    }
  }
  return (
    <div className="bg-willow-gray layout-center text-rust-gray">
      <div className="flex justify-between p-10">
        <span className="text-3xl text-merriweather">
          {selected.openfda.generic_name[0].toLowerCase()}
        </span>
        {data.signedIn ? (
          <form onSubmit={handleSubmit}>
            <span className="text-opensans justify-end flex items-center text-sm">
              <input
                className="rounded-md p-1 w-20 mx-1"
                placeholder="Dosage..."
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
              />
              <select
                className="rounded-md p-1 w-20 mx-1"
                value={route}
                onChange={(e) => setRoute(e.target.value)}>
                <option value="" disabled hidden>
                  Route
                </option>
                {selected.openfda.route.map((route) => (
                  <option key={route}>{route}</option>
                ))}
              </select>
              <input
                placeholder="Frequency"
                className="rounded-md p-1 w-20 mx-1"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              />
              <select
                className="rounded-md p-1 w-20 mx-1"
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}>
                <option value="" disabled hidden>
                  List
                </option>
                {data.lists.map((list) => (
                  <option key={list.listId} value={list.listId}>
                    {list.name}
                  </option>
                ))}
              </select>
              <button type="submit">
                <FontAwesomeIcon icon={faSquarePlus} size="2xl" />
              </button>
            </span>
          </form>
        ) : null}
      </div>
      <div className="text-2xl text-merriweather px-10 py-3">
        Used for
        <div className="text-opensans text-base p-3">
          {selected.purpose || selected.indications_and_usage}
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
