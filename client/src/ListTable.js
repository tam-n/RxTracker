import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import useFetchContents from './UseFetchContents';

export default function ListTable({ listId }) {
  const [editedCell, setEditedCell] = useState({ row: null, column: null });
  const [editedValue, setEditedValue] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const { listContents, handleDeleteClick } = useFetchContents({ listId });

  const handleEditClick = (row, column, value) => {
    setEditedCell({ row, column });
    setEditedValue(value);
  };

  const handleEditChange = (event) => {
    setEditedValue(event.target.value);
  };

  const handleEditSubmit = async (row, column, listContentId) => {
    try {
      const updatedContents = [...listContents];
      updatedContents[row][column] = editedValue;
      const editedRow = updatedContents[row];

      const body = {
        medicationId: editedRow.medicationId,
        genericName: editedRow.genericName,
        dosage: editedRow.dosage,
        route: editedRow.route,
        frequency: editedRow.frequency,
        listContentId: editedRow.listContentId,
        listId: editedRow.listId,
      };

      const response = await fetch(
        `/api/listContent/${editedRow.listContentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to update data: ${response.status}`);
      }

      setEditedCell({ row: null, column: null });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-200 border-b">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left min-w-20 max-w-20 whitespace-nowrap">
                    Generic Name
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left min-w-20 max-w-20 whitespace-nowrap">
                    Dosage
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left min-w-20 max-w-20 whitespace-nowrap">
                    Route
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left min-w-20 max-w-20 whitespace-nowrap">
                    Frequency
                  </th>
                </tr>
              </thead>
              <tbody>
                {listContents.map((content, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-900 min-w-44 max-w-40">
                      {content.genericName}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm min-w-20 max-w-20 ${
                        editedCell.row === rowIndex && editedCell.column === 1
                          ? 'bg-yellow-200'
                          : 'font-light text-gray-900'
                      }`}
                      onClick={() =>
                        handleEditClick(rowIndex, 1, content.dosage)
                      }>
                      {editedCell.row === rowIndex &&
                      editedCell.column === 1 ? (
                        <input
                          type="text"
                          value={editedValue}
                          onChange={handleEditChange}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              handleEditSubmit(
                                rowIndex,
                                'dosage',
                                content.listContentId
                              );
                            }
                          }}
                          onBlur={() => handleEditSubmit(rowIndex, 1)}
                          autoFocus
                        />
                      ) : (
                        content.dosage
                      )}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm min-w-20 max-w-20 ${
                        editedCell.row === rowIndex && editedCell.column === 2
                          ? 'bg-yellow-200'
                          : 'font-light text-gray-900'
                      }`}
                      onClick={() =>
                        handleEditClick(rowIndex, 2, content.route)
                      }>
                      {editedCell.row === rowIndex &&
                      editedCell.column === 2 ? (
                        <input
                          type="text"
                          value={editedValue}
                          onChange={handleEditChange}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              handleEditSubmit(
                                rowIndex,
                                'route',
                                content.listContentId
                              );
                            }
                          }}
                          onBlur={() => handleEditSubmit(rowIndex, 2)}
                          autoFocus
                        />
                      ) : (
                        content.route
                      )}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm min-w-20 max-w-20 ${
                        editedCell.row === rowIndex && editedCell.column === 3
                          ? 'bg-yellow-200'
                          : 'font-light text-gray-900'
                      }`}
                      onClick={() =>
                        handleEditClick(rowIndex, 3, content.frequency)
                      }>
                      {editedCell.row === rowIndex &&
                      editedCell.column === 3 ? (
                        <input
                          type="text"
                          value={editedValue}
                          onChange={handleEditChange}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              handleEditSubmit(
                                rowIndex,
                                'frequency',
                                content.listContentId
                              );
                            }
                          }}
                          onBlur={() => handleEditSubmit(rowIndex, 3)}
                          autoFocus
                        />
                      ) : (
                        content.frequency
                      )}
                    </td>
                    <td>
                      {!selectedContent ? (
                        <button
                          onClick={() =>
                            setSelectedContent(content.listContentId)
                          }>
                          <FontAwesomeIcon icon={faTrashCan} className="ml-5" />
                        </button>
                      ) : (
                        <span className="flex justify-between">
                          <button
                            onClick={() =>
                              handleDeleteClick(
                                selectedContent,
                                setSelectedContent
                              )
                            }>
                            Delete
                          </button>
                          <button onClick={() => setSelectedContent(null)}>
                            Cancel
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
