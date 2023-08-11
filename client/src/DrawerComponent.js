import React, { useState, useContext } from 'react';
import { DataContext } from './App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faSquarePlus,
} from '@fortawesome/free-solid-svg-icons';
import ListDropDown from './ListDropDown';

export default function DrawerComponent() {
  const data = useContext(DataContext);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

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
      <button
        className="fixed left-5 top-1/2"
        onClick={() => data.setIsOpen(true)}>
        {data.isOpen === false ? (
          <FontAwesomeIcon icon={faChevronRight} size="2xl" />
        ) : null}
      </button>
      <main
        className={
          'fixed overflow-hidden bg-gray-900 inset-0 transform ease-in-out ' +
          (data.isOpen
            ? 'transition-opacity opacity-100 duration-500 translate-x-0'
            : 'transition-all delay-500 opacity-0 -translate-x-full')
        }>
        <section
          className={
            'w-screen max-w-xs left-0 top-20 absolute bg-minato-village-gray h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform ' +
            (data.isOpen ? 'translate-x-0' : '-translate-x-full')
          }>
          <article className="relative w-screen max-w-xs pb-10 flex flex-col space-y-6 overflow-y-scroll h-full">
            <div className="flex justify-between">
              <header className="p-4 font-bold text-lg text-merriweather">
                Current Lists
              </header>
              {!showInput && (
                <button className="w-6 m-5" onClick={handlePlusButtonClick}>
                  <FontAwesomeIcon icon={faSquarePlus} size="xl" />
                </button>
              )}
            </div>
            {showInput && (
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
            )}
            {data.lists
              ? data.lists.map((list) => {
                  return (
                    <ListDropDown
                      listName={list.name}
                      listId={list.listId}
                      key={list.listId}
                    />
                  );
                })
              : null}
          </article>
        </section>
        <section
          className="w-screen h-full cursor-pointer"
          onClick={() => {
            data.setIsOpen(false);
          }}></section>
      </main>
    </>
  );
}
