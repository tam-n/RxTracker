import { Disclosure } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useContext } from 'react';
import { DataContext } from './App';

export default function ListDropDown({ listName, listId }) {
  const [listContents, setListContents] = useState([]);
  const data = useContext(DataContext);

  useEffect(() => {
    async function fetchListContent() {
      try {
        const response = await fetch(`/api/listContent/${listId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const contents = await response.json();
        console.log(contents);
        setListContents(contents);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListContent();
  }, [listId]);

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium text-black  hover:bg-rust-gray focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
            <span>{listName}</span>
            <FontAwesomeIcon
              icon={faChevronUp}
              className={`${
                open ? 'rotate-180 transform' : ''
              } h-5 w-5 text-purple-500`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pb-2 text-sm text-white">
            {listContents.map((content) => {
              return (
                <div key={content.listContentId} className="flex my-2">
                  <div className="truncate max-w-sm w-32 mx-2">
                    {content.genericName}
                  </div>
                  <div className="w-10 mx-2">{content.dosage}</div>
                  <button className="mx-2">
                    <FontAwesomeIcon icon={faFileLines} size="lg" />
                  </button>
                  <button className="mx-2">
                    <FontAwesomeIcon icon={faTrashCan} size="lg" />
                  </button>
                </div>
              );
            })}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
