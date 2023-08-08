import { Disclosure } from '@headlessui/react';
import ListTable from './ListTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function ListTableDropDown({ listName, listId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState('');

  const handleEditClick = () => {
    setEditedValue(listName);
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const body = {
        name: editedValue,
      };

      const response = await fetch(`/api/lists/${listId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Failed to update data: ${response.status}`);
      }
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelClick = () => {
    setEditedValue('');
    setIsEditing(false);
  };

  return (
    <div className="px-10 sm:px-20">
      <Disclosure>
        <div className="flex justify-center">
          {!isEditing ? (
            <span className="mx-5">
              <Disclosure.Button className="py-2 w-full">
                {editedValue ? editedValue : listName}
              </Disclosure.Button>
            </span>
          ) : (
            <input
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}></input>
          )}
          <button onClick={handleEditClick}>
            <FontAwesomeIcon icon={faPencil} />
          </button>
          {isEditing ? (
            <>
              <button onClick={handleSaveClick}>Save</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </>
          ) : null}
        </div>
        <Disclosure.Panel className="text-gray-500">
          <ListTable listId={listId} />
        </Disclosure.Panel>
      </Disclosure>
    </div>
  );
}
