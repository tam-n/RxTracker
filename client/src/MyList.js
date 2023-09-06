import { useContext, useState } from 'react';
import { DataContext } from './App';
import ListTableDropDown from './ListTableDropDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

export default function MyList() {
  const data = useContext(DataContext);
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handlePlusButtonClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setShowInput(false);
    setInputValue('');
  };

  const handleInputKeyPress = async (e) => {
    if (e.key === 'Enter') {
      setShowInput(false);
      setInputValue('');

      try {
        const response = await fetch('/api/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
          body: JSON.stringify({ name: inputValue }),
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const newList = await response.json();
        data.setLists([...data.lists, newList]);
      } catch (error) {
        console.log('Error:', error.message);
      }
    }
  };

  return (
    <>
      {data.lists.length > 0 ? (
        data.lists.map((list) => {
          return (
            <ListTableDropDown
              key={list.listId}
              listName={list.name}
              listId={list.listId}
            />
          );
        })
      ) : (
        <span className="flex justify-center">No Medication Lists Found</span>
      )}
      {!showInput ? (
        <span className="flex justify-center items-center">
          Add a list
          <button className="w-6 m-2" onClick={handlePlusButtonClick}>
            <FontAwesomeIcon icon={faSquarePlus} size="xl" />
          </button>
        </span>
      ) : (
        <div className="flex justify-center items-center">
          <input
            type="text"
            className="rounded-md border m-5 p-1"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleInputKeyPress}
            autoFocus
            placeholder="Enter name of list"
          />
        </div>
      )}
    </>
  );
}
