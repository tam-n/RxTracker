import './App.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import SearchPage from './Pages/SearchPage';
import InfoPage from './Pages/InfoPage';
import React from 'react';
import { useState, useEffect } from 'react';
import DrawerComponent from './DrawerComponent';
import ListPage from './Pages/ListPage';
import SignInPage from './SignInPage';
import SignupPage from './SignupPage';

export const DataContext = React.createContext();

function App() {
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [lists, setLists] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [listContents, setListContents] = useState({});
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (signedIn === false) {
      sessionStorage.removeItem('token');
      return;
    }

    async function fetchLists() {
      const req = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      };

      try {
        const response = await fetch('/api/lists', req);
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
  }, [signedIn, lists]);

  const data = {
    selected,
    setSelected,
    error,
    setError,
    lists,
    setLists,
    isOpen,
    setIsOpen,
    listContents,
    setListContents,
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
        <DrawerComponent />
        <div className="content">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="info" element={<InfoPage />} />
            <Route path="mylist" element={<ListPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route
              path="signin"
              element={
                <SignInPage signedIn={signedIn} setSignedIn={setSignedIn} />
              }
            />
          </Routes>
        </div>
      </DataContext.Provider>
    </div>
  );
}

export default App;
