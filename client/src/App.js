import './App.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import SearchPage from './Pages/SearchPage';
import InfoPage from './Pages/InfoPage';
import React from 'react';
import { useState } from 'react';

export const DataContext = React.createContext();

function App() {
  const [selected, setSelected] = useState(null);
  const data = {
    selected,
    setSelected,
  };
  console.log(selected);

  return (
    <div>
      <DataContext.Provider value={data}>
        <NavBar />
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="info" element={<InfoPage />} />
        </Routes>
      </DataContext.Provider>
    </div>
  );
}

export default App;
