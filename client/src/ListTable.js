import { useEffect, useState } from 'react';

export default function ListTable({ listId }) {
  const [listContents, setListContents] = useState([]);
  const [editedCell, setEditedCell] = useState({ row: null, column: null });
  const [editedValue, setEditedValue] = useState('');

  useEffect(() => {
    async function fetchListContent() {
      try {
        const response = await fetch(`/api/listContent/${listId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const contents = await response.json();
        setListContents(contents);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListContent();
  }, [listId]);

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
      const selectedRow = updatedContents[row];
      console.log(selectedRow);

      const body = {
        medicationId: selectedRow.medicationId,
        genericName: selectedRow.genericName,
        dosage: selectedRow.dosage,
        route: selectedRow.route,
        frequency: selectedRow.frequency,
        listContentId: selectedRow.listContentId,
        listId: selectedRow.listId,
      };

      const response = await fetch(
        `/api/listContent/${selectedRow.listContentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
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
    <div className="">
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
