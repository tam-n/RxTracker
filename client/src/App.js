import './App.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import SearchPage from './Pages/SearchPage';
import InfoPage from './Pages/InfoPage';
import React from 'react';
import { useState, useEffect } from 'react';
import DrawerComponent from './DrawerComponent';

export const DataContext = React.createContext();

function App() {
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [lists, setLists] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchLists() {
      try {
        const response = await fetch('/api/lists');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const lists = await response.json();
        setLists(lists);
      } catch (error) {
        setError(error);
      }
    }
    fetchLists();
  }, []);

  const data = {
    selected,
    setSelected,
    error,
    setError,
    lists,
    setLists,
    isOpen,
    setIsOpen,
  };
  console.log(selected);

  if (error) {
    console.error('Fetch error:', error);
    return <div>Error! {error.message}</div>;
  }

  return (
    <div>
      <DataContext.Provider value={data}>
        <NavBar />
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="info" element={<InfoPage />} />
        </Routes>
        <DrawerComponent />
      </DataContext.Provider>
    </div>
  );
}

export default App;
